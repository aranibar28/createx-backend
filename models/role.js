const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
  title:  { type: String, required: true, unique: true },
  allows: { type: Object, required: false, default: {} },
});

RoleSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Role", RoleSchema);
