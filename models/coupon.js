const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const CouponSchema = Schema({
   code:  { type: String, required: true },
   type:  { type: String, required: true },
   value: { type: Number, required: true },
   limit: { type: Number, required: true },
}, timestamps);

CouponSchema.plugin(mongoosePaginate);
CouponSchema.method("toJSON", function () {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model("Coupon", CouponSchema);
