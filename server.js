const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || "mongodb://atlas-sql-680401721a6f6b782dd97e29-aaied.a.query.mongodb.net/timecapsule?ssl=true&authSource=admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Message schema + model
const messageSchema = new mongoose.Schema({
  title: String,
  mood: String,
  content: String,
  openAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

// Routes

// GET all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

// POST new message
app.post("/messages", async (req, res) => {
  try {
    const { title, mood, content, openAt } = req.body;

    if (!title || !mood || !content || !openAt) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMsg = new Message({ title, mood, content, openAt });
    await newMsg.save();

    res.status(201).json({ message: "Message saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving message:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Default route (for sanity check)
app.get("/", (req, res) => {
  res.send("📬 Time Capsule backend is live!");
});
// DELETE a message by ID
app.delete("/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
