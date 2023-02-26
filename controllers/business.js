const { response } = require("express");
const { deleteImage } = require("../middlewares/cloudinary");
const Business = require("../models/business");
const Config = require("../models/config");
const Branch = require("../models/branch");

const create_business = async (req, res = response) => {
   let data = req.body;
   try {
      let exist_ruc = await Business.findOne({ ruc: data.ruc });

      if (exist_ruc) {
         return res.json({ msg: "Este RUC ya se encuentra registrado.", exist: true });
      } else {
         let reg = await Business.create(data);
         await Config.create({ business: reg._id });
         return res.json({ data: reg });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_business = async (req, res = response) => {
   try {
      let reg = await Business.find();
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_business_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Business.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_business = async (req, res = response) => {
   let id = req.params["id"];
   const { ruc, ...data } = req.body;

   try {
      const business = await Business.findById(id);

      if (business.ruc != ruc) {
         const exist_ruc = await Business.findOne({ ruc });
         if (exist_ruc) {
            return res.json({ msg: "Este RUC ya se encuentra registrado.", exist: true });
         }
      }

      data.ruc = ruc;

      let reg = await Business.findByIdAndUpdate(id, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_business = async (req, res = response) => {
   let id = req.params["id"];
   try {
      const exist = await Branch.findOne({ business: id });
      if (exist) {
         return res.json({ msg: "No puedes eliminar un negocio asignado." });
      }

      let reg = await Business.findByIdAndDelete(id);
      await Config.findOneAndDelete({ business: reg._id });
      if (reg.image.public_id) {
         await deleteImage(reg.image.public_id);
      }
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_config = async (req, res = response) => {
   try {
      let reg = await Config.find();
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_config = async (req, res = response) => {
   let id = req.params["id"];
   const data = req.body;
   try {
      let reg = await Config.findOneAndUpdate({ business: id }, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   create_business,
   read_business,
   read_business_by_id,
   update_business,
   delete_business,
   read_config,
   update_config,
};
