const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");

const Sale_DetailSchema = Schema({
   customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
   product:  { type: Schema.Types.ObjectId, ref: "Product", required: true },
   sale:     { type: Schema.Types.ObjectId, ref: "Sale", required: true },
   price:    { type: Number, required: true },
   quantity: { type: Number, required: true },
   variety:  { type: String, required: false },
   selected: { type: String, required: false },
}, timestamps);

Sale_DetailSchema.method("toJSON", function () {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model("Sale_Detail", Sale_DetailSchema);
