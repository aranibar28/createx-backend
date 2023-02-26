const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data")

const AddressSchema = Schema({
   customer:          { type: Schema.Types.ObjectId, ref: "Customer", required: true },
   recipient:         { type: String, required: true },
   dni:               { type: String, required: true },
   phone:             { type: String, required: true },
   address:           { type: String, required: true },
   zip:               { type: String, required: false },
   region:            { type: String, required: false },
   province:          { type: String, required: false },
   district:          { type: String, required: false },
   display_region:    { type: String, required: false },
   display_province:  { type: String, required: false },
   display_district:  { type: String, required: false },
   status:            { type: Boolean, required: true, default: false },
}, timestamps);

AddressSchema.method("toJSON", function () {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model("Address", AddressSchema);
