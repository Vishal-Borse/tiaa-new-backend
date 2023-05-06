const mongoose = require("mongoose");
const consumerSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  aadharNo: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  age: { type: Number, default: 0 },
  phone: { type: Number, default: 0 },
  password: { type: String, required: true },
});

const consumerModel = mongoose.model("Consumer", consumerSchema);

module.exports = consumerModel;
