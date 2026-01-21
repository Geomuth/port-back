const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const { authenticate } = require('../middleware/auth');

// Get all subscribers
router.get('/', authenticate, async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add new subscriber
router.post('/', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ success: false, error: 'Email already subscribed' });
    }

    const subscriber = new Subscriber({
      email,
      name: name || 'Subscriber'
    });

    await subscriber.save();
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed',
      data: subscriber
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete subscriber
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    res.json({
      success: true,
      message: 'Subscriber deleted',
      data: subscriber
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get subscriber stats
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ isActive: true });
    const newSubscribersThisMonth = await Subscriber.countDocuments({
      subscribedAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });

    res.json({
      success: true,
      data: {
        total: totalSubscribers,
        active: activeSubscribers,
        newThisMonth: newSubscribersThisMonth
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
