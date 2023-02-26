const { response } = require("express");
const { titleCase } = require("../utils/functions");
const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");

const create_customer = async (req, res = response) => {
   let data = req.body;
   try {
      let exist_email = await Customer.findOne({ email: data.email });
      if (exist_email) {
         return res.json({ msg: "Este correo ya se encuentra registrado." });
      } else {
         data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
         data.full_name = titleCase(data.first_name + " " + data.last_name);
         let reg = await Customer.create(data);
         return res.json({ data: reg });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_customers = async (req, res = response) => {
   const { page = 1, limit = 10, search = "", status } = req.query;

   try {
      const query = {
         full_name: { $regex: search, $options: "i" },
         status: { $ne: null },
      };

      if (status) {
         query.status = status;
      }

      const options = {
         page,
         limit,
      };

      let reg = await Customer.paginate(query, options);

      return res.json(reg);
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_customer_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Customer.findById(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ data: undefined });
   }
};

const update_customer = async (req, res = response) => {
   let id = req.params["id"];

   try {
      const customer = await Customer.findById(id);
      const { email, password, ...data } = req.body;

      if (customer.email != email) {
         var exist_email = await Customer.findOne({ email });
         if (exist_email) {
            return res.json({ msg: "Este correo ya se encuentra registrado.", exist: true });
         } else {
            data.email = email;
         }
      }

      if (password) {
         data.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
      }

      data.full_name = titleCase(data.first_name + " " + data.last_name);
      let reg = await Customer.findByIdAndUpdate(id, data, { new: true });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const delete_customer = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Customer.findByIdAndDelete(id);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   create_customer,
   read_customers,
   read_customer_by_id,
   update_customer,
   delete_customer,
};
