const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Message = require("./models/Message");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/api/messages", async (req, res) => {
  const now = new Date();
  const messages = await Message.find({ openDate: { $lte: now } }).sort({ openDate: -1 });
  res.json(messages);
});

app.post("/api/messages", async (req, res) => {
  const { message, openDate } = req.body;
  const newMessage = new Message({ message, openDate });
  await newMessage.save();
  res.status(201).json({ message: "Saved successfully!" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
