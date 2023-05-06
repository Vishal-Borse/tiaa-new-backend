const mongoose = require("mongoose");


const organisationSchema = mongoose.Schema({
  name: { type: String, required: true },
  liscenseId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// userSchema.index({ name: "text" });

const organisationModel = mongoose.model("Organisation", organisationSchema);

module.exports = organisationModel;
