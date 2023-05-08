const mongoose = require("mongoose");
const wishListSchema = mongoose.Schema({
  eventId: { type: String, required: true },

  requestingUsers: [
    {
      userId: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
  ],
});

const wishListModel = mongoose.model("Wishlist", wishListSchema);

module.exports = wishListModel;
