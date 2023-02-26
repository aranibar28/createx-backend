const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = Schema({
  title:         { type: String, required: true, unique: true },
  slug:          { type: String, required: true },
  price:         { type: Number, required: true },
  stock:         { type: Number, required: true },
  description:   { type: String, required: false },
  container:     { type: String, required: false },
  title_variety: { type: String, required: false },
  items_variety: { type: Array, required: false, default: [] },
  gallery:       { type: Array, required: false, default: [] },
  image:         { type: Object, required: false, default: {} },
  num_sales:     { type: Number, required: true, default: 0 },
  num_points:    { type: Number, required: true, default: 0 },
  status:        { type: Boolean, required: true, default: false },
  category:      { type: Schema.Types.ObjectId, required: true, ref: "Category" },
}, timestamps);

ProductSchema.plugin(mongoosePaginate);
ProductSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Product", ProductSchema);
