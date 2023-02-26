const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const EmployeeSchema = Schema({
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  dni:        { type: String, required: true },
  first_name: { type: String, required: true },
  last_name:  { type: String, required: true },
  full_name:  { type: String, required: false },
  image:      { type: Object, required: false, default: {} },
  status:     { type: Boolean, required: false, default: false },
}, timestamps);

EmployeeSchema.plugin(mongoosePaginate);
EmployeeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Employee", EmployeeSchema);
