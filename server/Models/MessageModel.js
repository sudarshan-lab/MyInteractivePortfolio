

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content:      { type: String, required: true },
  sender:       { type: String, required: true },
  email:        { type: String, required: true },
  timestamp:    { type: Date,   default: Date.now },
  isPrivate:    { type: Boolean, default: false },
}, {
  collection: 'messages' 
});

module.exports = mongoose.model('Message', messageSchema);
