const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const CategorySchema = Schema({
  title:       { type: String, required: true, unique: true },
  icon:        { type: String, required: false, default: "" },
  description: { type: String, required: false, default: "" },
  image:       { type: Object, required: false, default: {} },
  discount:    { type: Boolean, required: false, default: false },
  status:      { type: Boolean, required: false, default: false }
}, timestamps);

CategorySchema.index({ title: 1 });
CategorySchema.plugin(mongoosePaginate);
CategorySchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Category", CategorySchema);
