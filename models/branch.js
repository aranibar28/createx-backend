const { Schema, model } = require("mongoose");
const { timestamps } = require("../utils/data")

const BranchSchema = Schema({
  status:   { type: Boolean, required: true, default: false },
  business: { type: Schema.Types.ObjectId, required: true, ref: "Business" },
  employee: { type: Schema.Types.ObjectId, required: true, ref: "Employee" },
  role:     { type: Schema.Types.ObjectId, required: true, ref: "Role" },
}, timestamps );

BranchSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Branch", BranchSchema);
