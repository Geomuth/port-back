const express = require('express');
const router = express.Router();
const Email = require('../models/Email');
const { authenticate } = require('../middleware/auth');

// Get all emails
router.get('/', authenticate, async (req, res) => {
  try {
    const emails = await Email.find().sort({ receivedAt: -1 });
    res.json({
      success: true,
      count: emails.length,
      data: emails
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get new emails (for reply)
router.get('/new/list', authenticate, async (req, res) => {
  try {
    const newEmails = await Email.find({ status: 'new' }).sort({ receivedAt: -1 });
    res.json({
      success: true,
      count: newEmails.length,
      data: newEmails
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Submit new email (from contact form)
router.post('/', async (req, res) => {
  try {
    const { senderName, senderEmail, subject, message } = req.body;

    if (!senderEmail || !message) {
      return res.status(400).json({ success: false, error: 'Email and message are required' });
    }

    const email = new Email({
      senderName: senderName || 'Anonymous',
      senderEmail,
      subject: subject || 'No Subject',
      message,
      status: 'new'
    });

    await email.save();
    res.status(201).json({
      success: true,
      message: 'Email received successfully',
      data: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mark email as read
router.patch('/:id/read', authenticate, async (req, res) => {
  try {
    const email = await Email.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    res.json({
      success: true,
      message: 'Email marked as read',
      data: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reply to email
router.patch('/:id/reply', authenticate, async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ success: false, error: 'Reply message is required' });
    }

    const email = await Email.findByIdAndUpdate(
      req.params.id,
      {
        isReplied: true,
        replyMessage,
        repliedAt: new Date(),
        status: 'replied'
      },
      { new: true }
    );

    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete email
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, error: 'Email not found' });
    }
    res.json({
      success: true,
      message: 'Email deleted',
      data: email
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get email stats
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const totalEmails = await Email.countDocuments();
    const newEmails = await Email.countDocuments({ status: 'new' });
    const repliedEmails = await Email.countDocuments({ status: 'replied' });

    res.json({
      success: true,
      data: {
        total: totalEmails,
        new: newEmails,
        replied: repliedEmails
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
