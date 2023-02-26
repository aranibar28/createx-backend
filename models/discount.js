const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const DiscountSchema = Schema({
  title:       { type: String, required: true },
  value:       { type: Number, required: true },
  start_date:  { type: String, required: true },
  finish_date: { type: String, required: true },
}, timestamps);

DiscountSchema.plugin(mongoosePaginate);
DiscountSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Discount", DiscountSchema);
