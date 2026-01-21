const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  isReplied: {
    type: Boolean,
    default: false
  },
  replyMessage: {
    type: String,
    default: null
  },
  repliedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
});

module.exports = mongoose.model('Email', emailSchema);
