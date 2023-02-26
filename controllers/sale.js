const { response } = require("express");
const { setup_stock } = require("../utils/features");
const { zfill } = require("../utils/functions");

const Sale = require("../models/sale");
const Sale_Detail = require("../models/sale_details");
const Review = require("../models/review");

const register_order = async (req, res = response) => {
   let data = req.body;
   let details = data.details;
   try {
      let last_sale = await Sale.find().sort({ created_at: -1 });
      if (last_sale.length == 0) {
         data.code = "001-000001";
      } else {
         const last_code = last_sale[0].code;
         const arr_code = last_code.split("-");
         if (arr_code[1] != "999999") {
            const new_correlative = zfill(parseInt(arr_code[1]) + 1, 6);
            data.code = arr_code[0] + "-" + new_correlative;
         } else if (arr_code[1] == "999999") {
            const new_serie = zfill(parseInt(arr_code[0]) + 1, 3);
            data.code = new_serie + "-000001";
         }
      }

      let reg = await Sale.create(data);

      for (let item of details) {
         let details = {
            sale: reg._id,
            customer: data.customer,
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            variety: item.title_variety,
            selected: item.items_variety[item.selected]
         };
         let det = await Sale_Detail.create(details);
         setup_stock(det.product, det.quantity);
      }

      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const get_order_customer = async (req, res = response) => {
   const id = req.params["id"];
   try {
      const ordersPromise = Sale.find({ customer: id }).sort({ created_at: -1 });
      const detailsPromise = Sale_Detail.find({ customer: id }).populate("product");
      const reviewsPromise = Review.find({ customer: id });

      const [orders, details, reviews] = await Promise.all([ordersPromise, detailsPromise, reviewsPromise]);

      const data = orders.map((order) => {
         const orderDetails = details.filter((detail) => detail.sale.toString() === order._id.toString());
         const newDetails = orderDetails.map((detail) => {
            const review = reviews.find((review) => review.product.toString() === detail.product._id.toString());
            return {
               ...detail._doc,
               review: review,
            };
         });
         return { ...order._doc, details: newDetails };
      });

      return res.json({ data });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const get_order_detail = async (req, res = response) => {
   var id = req.params["id"];
   try {
      let sale = await Sale.findById({ _id: id }).populate("address").populate("customer");

      return res.json({ data: sale, details: details });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   register_order,
   get_order_customer,
   get_order_detail,
};
