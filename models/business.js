const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");

const BusinessSchema = Schema(
  {
    ruc:      { type: String, required: true },
    title:    { type: String, required: true },
    district: { type: String, required: false },
    province: { type: String, required: false },
    address:  { type: String, required: false },
    email:    { type: String, required: false },
    phone:    { type: String, required: false },
    image:    { type: Object, required: false, default: {} },
  },
  timestamps
);

BusinessSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Business", BusinessSchema);
