const { response } = require("express");
const Coupon = require("../models/coupon");

const create_coupon = async (req, res = response) => {
   let data = req.body;
   try {
      let exist = await Coupon.findOne({ code: data.code });
      if (exist) {
         return res.json({ msg: "Este cupón ya se encuentra registrado.", exist: true });
      }
      let reg = await Coupon.create(data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_coupons = async (req, res = response) => {
   const { page = 1, limit = 10, search = "", status, } = req.query;
   try {
      const query = {
         code: { $regex: search, $options: "i" },
      };

      if (status) {
         query.status = status;
      }

      const options = {
         page,
         limit,
      };

      let reg = await Coupon.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_coupon_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Coupon.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_coupon = async (req, res = response) => {
   let id = req.params["id"];
   let data = req.body;
   try {
      let reg = await Coupon.findByIdAndUpdate(id, data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_coupon = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Coupon.findByIdAndDelete(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_coupons = async (req, res = response) => {
   let data = req.body;
   try {
      let ids = data.map(item => item._id);
      const deleted = await Coupon.deleteMany({ _id: { $in: ids } });
      return res.json(deleted);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const validate_coupon = async (req, res = response) => {
   let coupon = req.params["coupon"];
   try {
      let reg = await Coupon.findOne({ code: coupon });

      if (!reg) {
         return res.json({ msg: "Cupón no válido o expirado." });
      }

      if (reg.limit == 0) {
         return res.json({ msg: "Se alcanzó el límite de stock de este cupón." });
      }

      return res.json({ data: reg });

   } catch (error) {
      return res.json({ msg: error.message });
   }

};

module.exports = {
   create_coupon,
   read_coupons,
   read_coupon_by_id,
   update_coupon,
   delete_coupon,
   delete_coupons,
   validate_coupon,
};
