const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const SaleSchema = Schema({
   customer:       { type: Schema.Types.ObjectId, ref: "Customer", required: true },
   address:        { type: Schema.Types.ObjectId, ref: "Address", required: true },
   subtotal:       { type: Number, required: true },
   type_delivery:  { type: String, required: false },
   price_delivery: { type: Number, required: false },
   transaction:    { type: String, required: false },
   payment_method: { type: String, required: false },
   code:           { type: String, required: false },
   discount:       { type: Number, required: false },
   coupon:         { type: String, required: false },
   payment:        { type: String, required: false, default: "Procesando" },
   status:         { type: String, required: false, default: "Procesando" },
   notes:          { type: String, required: false, default: "" },
}, timestamps);

SaleSchema.plugin(mongoosePaginate);
SaleSchema.method("toJSON", function () {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model("Sale", SaleSchema);
