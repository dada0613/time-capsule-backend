const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  title: {type: String, required: true},
  message: {type: String, required: true},
  openDate: {type: Date, required: true},
  createdAt: {type: Date, default: Date.now},
  mood: {type: String, enum: ['happy', 'neutral', 'sad'], default: 'neutral'}
});

module.exports = mongoose.model('Message', messageSchema);
