const { response } = require("express");
const Review = require("../models/review");
const Product = require("../models/product");

const read_review_customer = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Review.find({ customer: id })
         .sort({ created_at: -1 })
         .populate("customer", "full_name email")
         .populate("product", "title slug image");
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_review_product = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Review.find({ product: id })
         .sort({ created_at: -1 })
         .populate("customer", "full_name email")
         .populate("product", "title slug image");
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const send_review_product = async (req, res = response) => {
   let data = req.body;
   try {
      let reg = await Review.create(data);
      updateRating(reg.product)
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const edit_review_product = async (req, res = response) => {
   let id = req.params["id"];
   let data = req.body;
   try {
      let reg = await Review.findByIdAndUpdate(id, data);
      updateRating(reg.product)
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const del_review_product = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Review.findByIdAndDelete(id);
      updateRating(reg.product)
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const updateRating = async (id) => {
   let reviews = await Review.find({ product: id });
   if (reviews.length === 0) {
      await Product.findByIdAndUpdate(id, { num_points: 0 });
   } else {
      let total = 0;
      for (const item of reviews) {
         total += item.starts;
      }
      total = total / reviews.length;
      await Product.findByIdAndUpdate(id, { num_points: total });
   }
}


module.exports = {
   read_review_customer,
   read_review_product,
   send_review_product,
   edit_review_product,
   del_review_product
};
