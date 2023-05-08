const mongoose = require("mongoose");

const userSlotSchema = mongoose.Schema({
  consumerEmail: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endsTime: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  rationDetails: [
    {
      Item: {
        type: String,
        required: true,
      },
      Quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const userSlotsModel = mongoose.model("userSlots", userSlotSchema);

module.exports = userSlotsModel;
