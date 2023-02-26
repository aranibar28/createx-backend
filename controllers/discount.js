const { response } = require("express");
const Discount = require("../models/discount");
const moment = require("moment");

const create_discount = async (req, res = response) => {
   const data = req.body;
   try {
      const reg = await Discount.create(data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_discounts = async (req, res = response) => {
   const { page = 1, limit = 10, search = "", status, } = req.query;
   try {
      const query = {
         title: { $regex: search, $options: "i" },
      };

      if (status) {
         query.status = status;
      }

      const options = {
         page,
         limit,
      };

      let reg = await Discount.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const read_discount_by_id = async (req, res = response) => {
   const id = req.params["id"];
   try {
      let reg = await Discount.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const update_discount = async (req, res = response) => {
   const id = req.params["id"];
   const data = req.body;
   try {
      let reg = await Discount.findByIdAndUpdate(id, data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_discount = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Discount.findByIdAndDelete(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_discounts = async (req, res = response) => {
   let data = req.body;
   try {
      let ids = data.map(item => item._id);
      const deleted = await Discount.deleteMany({ _id: { $in: ids } });
      return res.json(deleted);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const validate_discount = async (req, res = response) => {
   try {
      const discounts = await Discount.find().sort({ created_at: -1 });
      let today = Date.parse(new Date().toString()) / 1000;

      let array = discounts.filter((item) => {
         let start = Date.parse(item.start_date + "T00:00:00") / 1000;
         let finish = Date.parse(item.finish_date + "T23:59:59") / 1000;
         return today >= start && today <= finish;
      });
      let discount = array[0]
      
      return res.json(discount);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   create_discount,
   read_discounts,
   read_discount_by_id,
   update_discount,
   delete_discount,
   delete_discounts,
   validate_discount,
};
