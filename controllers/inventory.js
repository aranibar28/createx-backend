const { response } = require("express");
const { increase_stock, decrease_stock } = require("../utils/features");
const Inventory = require("../models/inventory");
const moment = require("moment");

const create_inventory = async (req, res = response) => {
   let data = req.body;
   try {
      let reg = await Inventory.create(data);
      increase_stock(reg.product, reg.quantity);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_inventory = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Inventory.findByIdAndDelete(id);
      decrease_stock(reg.product, reg.quantity);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_inventory_input = async (req, res = response) => {
   const { page = 1, limit = 10, start, end } = req.query;
   const format = "DD-MM-YYYY";

   try {
      const query =
         start && end
            ? {
               created_at: {
                  $gte: moment(start, format).startOf("day").format(),
                  $lte: moment(end, format).endOf("day").format(),
               },
            }
            : {};

      const options = {
         page,
         limit,
         sort: { created_at: -1 },
         populate: [{ path: "product" }, { path: "supplier" }],
      };

      let reg = await Inventory.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_inventory_output = async (req, res = response) => {
   const { page = 1, limit = 10, start, end } = req.query;
   const format = "DD-MM-YYYY";
   try {
      const query =
         start && end
            ? {
               created_at: {
                  $gte: moment(start, format).startOf("day").format(),
                  $lte: moment(end, format).endOf("day").format(),
               },
            }
            : {};

      const options = {
         page,
         limit,
         sort: { created_at: -1 },
         populate: [{ path: "product" }, { path: "sale" }],
      };

      let reg = await Sale_Detail.paginate(query, options);
      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   create_inventory,
   read_inventory_input,
   read_inventory_output,
   delete_inventory,
};
