const { response } = require("express");
const { admin, role, business, config, branch } = require("../utils/data");
const { titleCase } = require("../utils/functions");

const Employee = require("../models/employee");
const Customer = require("../models/customer");
const Business = require("../models/business");
const Role = require("../models/role");

const jwt = require("../utils/jwt");
const bcrypt = require("bcryptjs");

const login_user = async (req, res = response) => {
   const { email, password } = req.body;
   try {
      let data = await Employee.findOne({ email });
      if (!data) {
         return res.json({ msg: "El correo o la contraseña son incorrectos." });
      } else {
         let valid_password = bcrypt.compareSync(password, data.password);
         if (!valid_password) {
            return res.json({ msg: "El correo o la contraseña son incorrectos." });
         } else {
            let token = await jwt.createToken(data);
            return res.json({ data, token });

         }
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const login = async (req, res = response) => {
   const { email, password } = req.body;
   try {
      let data = await Customer.findOne({ email });
      if (!data) {
         return res.json({ msg: "El correo o la contraseña son incorrectos." });
      } else {
         let valid_password = bcrypt.compareSync(password, data.password);
         if (!valid_password) {
            return res.json({ msg: "El correo o la contraseña son incorrectos." });
         } else {
            let token = await jwt.createToken(data);
            let address = await Address.findOne({ customer: data._id, status: true })
            return res.json({ data, address, token });
         }
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const register = async (req, res = response) => {
   let data = req.body;
   try {
      let exist_email = await Customer.findOne({ email: data.email });
      if (exist_email) {
         return res.json({ msg: "Este correo ya se encuentra registrado." });
      } else {
         data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
         data.full_name = titleCase(data.first_name + " " + data.last_name);
         let reg = await Customer.create(data);
         let token = await jwt.createToken(reg);
         return res.json({ data: reg, token });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const Config = require("../models/config");
const Branch = require("../models/branch");


const renew_token = async (req, res = response) => {
   let id = req.id;

   try {

      let data = await Branch.findOne({ employee: id }).populate([
         { path: "employee", select: "_id full_name email" },
         { path: "business", select: "_id title ruc address" },
         { path: "role", select: "_id title allows status" },
      ]);

      let config = await Config.findOne({ business: data.business });

      if (!data) {
         return res.json({ msg: "Usuario no permitido." });
      }

      const { employee, role } = data;

      const payload = new Object({
         _id: employee._id,
         full_name: employee.full_name,
         email: employee.email,
         role: role.title,
         allows: role.allows,
      });

      let token = await jwt.createToken(payload);

      return res.json({ data, config, token });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const Address = require("../models/address");

const refresh_token = async (req, res = response) => {
   let id = req.id;

   try {
      const data = await Customer.findById(id);

      if (!data) {
         return res.json({ msg: "Usuario no autenticado." });
      }

      const payload = new Object({
         _id: data._id,
         full_name: data.full_name,
         email: data.email,
      });

      let token = await jwt.createToken(payload);
      let address = await Address.findOne({ customer: id, status: true })

      return res.json({ data, address, token });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const seed_data = async (req, res = response) => {
   try {
      let existData = await User.count();
      if (!existData) {
         await Employee.create(admin);
         await Business.create(business);
         await Role.create(role);
         await Config.create(config);
         await Branch.create(branch);
         return res.json({ msg: "Data seeded successfully." });
      } else {
         return res.json({ msg: "Data already exists." });
      }
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

module.exports = {
   login,
   register,
   login_user,
   renew_token,
   refresh_token,
   seed_data,
};
