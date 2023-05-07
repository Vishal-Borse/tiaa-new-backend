const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  rationDetails: [
    {
      item: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      provider: {
        type: String,
        required: true,
      },
      mfgDate: {
        type: String,
        required: true,
      },
      expiryDate: {
        type: String,
        required: true,
      },
      allocatedPerUser: {
        type: Number,
        required: true,
      },
    },
  ],
  eventState: {
    type: String,
    required: true,
  },
  eventCity:{
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true,
  },
  eventDate: {
    type: String,
    required: true,
  },
  organizationEmail: {
    type: String,
    required: true,
  },
  rationSchedule: [
    {
      startTime: {
        type: String,
        required: true,
      },
      endTime: {
        type: String,
        required: true,
      },
    },
  ],

  //   liscenseId: { type: String, required: true },
  //   email: { type: String, required: true },
  //   password: { type: String, required: true },
});

// userSchema.index({ name: "text" });

const eventsModel = mongoose.model("Events", eventSchema);

module.exports = eventsModel;
