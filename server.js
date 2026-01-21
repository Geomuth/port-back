const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techgeo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import Routes
const subscriberRoutes = require('./routes/subscribers');
const emailRoutes = require('./routes/emails');
const authRoutes = require('./routes/auth');

// API Routes
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/auth', authRoutes);

// Serve admin dashboard
app.use(express.static('public'));

// Serve index.html for all other routes (for frontend)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
