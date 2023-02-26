
const { response } = require("express");
const Supplier = require("../models/supplier");

const create_supplier = async (req, res = response) => {
   let data = req.body;
   try {
      let exist_ruc = await Supplier.findOne({ ruc: data.ruc });

      if (exist_ruc) {
         return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
      }

      let reg = await Supplier.create(data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_suppliers = async (req, res = response) => {
   const { page = 1, limit = 10, search = "", status, order } = req.query;
   const sort = order == "desc" ? 1 : -1;

   try {
      const query = {
         name: { $regex: search, $options: "i" },
         status: { $ne: null },
      };

      if (status) {
         query.status = status;
      }

      const options = {
         page,
         limit,
         sort: { created_at: sort },
      };

      let reg = await Supplier.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_all_suppliers = async (req, res = response) => {
   try {
      let reg = await Supplier.find({ status: { $ne: null } });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_supplier_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Supplier.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_supplier = async (req, res = response) => {
   let id = req.params["id"];

   try {
      const supplier = await Supplier.findById(id);
      const { ruc, ...data } = req.body;

      if (supplier.ruc != ruc) {
         let exist_ruc = await Supplier.findOne({ ruc });
         if (exist_ruc) {
            return res.json({ msg: "Este título ya se encuentra registrado.", exist: true });
         }
      }

      data.ruc = ruc;

      let reg = await Supplier.findByIdAndUpdate(id, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_supplier = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Supplier.findByIdAndDelete(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   create_supplier,
   read_suppliers,
   read_all_suppliers,
   read_supplier_by_id,
   update_supplier,
   delete_supplier,
};
