const { response } = require("express");
const Address = require("../models/address");

const create_address = async (req, res = response) => {
   let data = req.body;
   try {

      let address = await Address.find({ customer: data.customer });

      if (address.length === 0) {
         data.status = true;
      } else {
         data.status = false;
      }

      let reg = await Address.create(data);
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const read_address_by_id = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Address.find({ customer: id }).populate("customer").sort({ created_at: -1 });
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};

const read_principal_address = async (req, res = response) => {
   let id = req.params["id"];
   try {
      let reg = await Address.findOne({ customer: id, status: true })
      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const update_address = async (req, res = response) => {
   let id = req.params["id"];
   let data = req.body;

   try {

      if (data.status) {
         await Address.updateMany({ customer: data.customer, _id: { $ne: id } }, { status: false });
      }

      let reg = await Address.findByIdAndUpdate(id, data, { new: true });

      return res.json({ data: reg });
   } catch (error) {
      return res.json({ msg: error.message });
   }
};


const delete_address = async (req, res = response) => {
   let id = req.params["id"];
   let address = await Address.findByIdAndDelete(id);

   if (address.status) {
      let otherAddress = await Address.findOne({ customer: address.customer, status: false });
      if (otherAddress) {
         otherAddress.status = true;
         await otherAddress.save();
      }
   }
   return res.json({ data: address });
};

module.exports = {
   create_address,
   read_address_by_id,
   read_principal_address,
   update_address,
   delete_address,
};
