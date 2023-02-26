const { Schema, model } = require("mongoose");

const ConfigSchema = Schema({
  business: { type: Schema.Types.ObjectId, required: true, ref: "Business" },
  tax:      { type: Number, required: false, default: 0.18 },
  currency: { type: String, required: false, default: "PEN" },
  ticket:   { type: Object, required: false, default: [{ serie: "B001", correlative: "0000001", status: true }] },
  invoice:  { type: Object, required: false, default: [{ serie: "F001", correlative: "0000001", status: true }] },
  status:   { type: Boolean, required: false, default: false },
  image:    { type: Object, required: false, default: {} },
});

ConfigSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Config", ConfigSchema);
