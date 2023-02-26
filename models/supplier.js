const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require("mongoose-paginate-v2");

const SupplierSchema = Schema(
  {
    ruc:     { type: String, required: true, unique: true },
    name:    { type: String, required: false },
    address: { type: String, required: false },
    phone:   { type: String, required: false },
    status:  { type: Boolean, required: true, default: false },
  },
  timestamps
);

SupplierSchema.plugin(mongoosePaginate);
SupplierSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Supplier", SupplierSchema);
