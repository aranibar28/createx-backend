const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data");
const mongoosePaginate = require('mongoose-paginate-v2');

const InventorySchema = Schema({
   quantity: { type: Number, required: true },
   product:  { type: Schema.Types.ObjectId, required: true, ref: "Product" },
   supplier: { type: Schema.Types.ObjectId, required: true, ref: "Supplier" },
}, timestamps);

InventorySchema.plugin(mongoosePaginate);
InventorySchema.method("toJSON", function () {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model("Inventory", InventorySchema);
