const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: 'https://cdpn.io',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

mongoose.connect(
  process.env.MONGO_URI || "mongodb+srv://amandahsu0613:vm6a04mp6@timecapsule.0tc9q5s.mongodb.net/?retryWrites=true&w=majority&appName=TimeCapsule",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection failed", err));

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

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});

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
    res.status(500).json({ error: "Internal server error." });
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found." });
    }
    res.json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

app.get("/", (req, res) => {
  res.send("Time Capsule backend is live!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
