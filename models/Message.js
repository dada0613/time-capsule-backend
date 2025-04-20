const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  openedContent: { type: String, required: true },
  openDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  mood: { type: String, default: "happy" },
  opened: { type: Boolean, default: false },
  wasOpened: { type: Boolean, default: false }
});

module.exports = mongoose.model("Message", messageSchema);
