const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const CustomerSchema = Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  full_name:  { type: String, required: false },
  dni:        { type: String, required: false },
  phone:      { type: String, required: false },
  birthday:   { type: String, required: false },
  genre:      { type: String, required: false, default: "" },
  image:      { type: Object, required: false, default: {} },
  status:     { type: Boolean, required: false, default: true },
}, timestamps);

CustomerSchema.plugin(mongoosePaginate);
CustomerSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Customer", CustomerSchema);
