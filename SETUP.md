# TechGeo Backend Setup - Quick Start Guide

## What's New

I've created a complete backend system for your TechGeo portfolio with:

### ✅ Features Added
1. **Subscriber Management** - Collect and manage newsletter subscribers
2. **Email/Contact Management** - Receive and manage contact form inquiries
3. **Admin Dashboard** - Beautiful interface to manage subscribers and emails
4. **Admin Authentication** - Secure login system
5. **Email Reply System** - Send replies directly from dashboard
6. **Statistics & Analytics** - Real-time overview of subscribers and emails

## 📁 Project Structure

```
portofolia/
├── server.js                 # Main backend server
├── package.json             # Node dependencies
├── .env                     # Environment configuration
├── models/                  # Database models
│   ├── Subscriber.js
│   ├── Email.js
│   └── Admin.js
├── routes/                  # API endpoints
│   ├── auth.js
│   ├── subscribers.js
│   └── emails.js
├── middleware/              # Authentication
│   └── auth.js
└── public/                  # Admin dashboard
    ├── admin.html
    ├── admin-style.css
    └── admin-script.js
```

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd /home/geoffrey/Desktop/portofolia
npm install
```

### Step 2: Install MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Install Locally**
- Download from: https://www.mongodb.com/try/download/community
- Follow installation instructions for your OS
- Start MongoDB service

**Option C: Use Cloud MongoDB (MongoDB Atlas)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update MONGODB_URI in .env file

### Step 3: Configure Environment
Edit `.env` file (already created):
```
MONGODB_URI=mongodb://localhost:27017/techgeo
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Backend
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB connected
```

## 📊 Accessing the Admin Dashboard

1. Open browser: `http://localhost:5000/admin.html`
2. Click "Register" to create your admin account
3. Login with your credentials
4. Start managing subscribers and emails!

## 🔗 Integrating with Frontend

Your `index.html` is already updated! The contact form and newsletter subscribe button now automatically send data to the backend.

### Newsletter Subscribe (in footer)
- Users enter email in newsletter box
- Clicks Subscribe button
- Email is saved to database

### Contact Form
- Users fill out contact form
- Clicks Send Message
- Email goes to database
- Admin can see it in dashboard and reply

## 📋 Admin Dashboard Features

### Overview Tab
- Total subscribers count
- Total emails count
- New emails waiting for reply
- Total emails replied
- Recent subscribers
- Recent email inquiries

### Subscribers Tab
- View all subscribers
- See subscription date
- Delete subscribers
- Quick refresh button

### Emails Tab
- View all contact emails
- Status: New/Read/Replied
- Reply to emails directly
- Delete emails
- See reply history

## 🔒 Security Notes

For Production:
1. Change JWT_SECRET to a strong random key
2. Set NODE_ENV=production
3. Use HTTPS/SSL certificate
4. Enable CORS properly
5. Add rate limiting
6. Use environment variables for sensitive data

## 🐛 Troubleshooting

**Problem: "Cannot connect to MongoDB"**
- Check if MongoDB is running
- Verify MONGODB_URI in .env

**Problem: "Port 5000 already in use"**
- Change PORT in .env file
- Or: `lsof -i :5000` then `kill -9 <PID>`

**Problem: Forms not submitting**
- Check browser console (F12)
- Verify API_BASE URL is correct
- Ensure backend is running

## 📞 API Endpoints

All public endpoints (no auth needed):
- `POST /api/subscribers` - Add subscriber
- `POST /api/emails` - Submit contact email

All protected endpoints (need JWT token):
- `GET /api/subscribers` - List all
- `GET /api/emails` - List all
- `GET /api/emails/stats/overview` - Email stats
- `PATCH /api/emails/:id/reply` - Send reply

## ✅ Testing

### Test Subscribe
```bash
curl -X POST http://localhost:5000/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Test Contact Email
```bash
curl -X POST http://localhost:5000/api/emails \
  -H "Content-Type: application/json" \
  -d '{"senderName":"John","senderEmail":"john@example.com","subject":"Test","message":"Test message"}'
```

## 📚 Next Steps

1. Deploy MongoDB (use MongoDB Atlas for easy cloud hosting)
2. Deploy backend (use Heroku, AWS, Vercel, etc.)
3. Update API_BASE URL in both:
   - `index.html` (line with `const API_BASE = ...`)
   - `public/admin-script.js` (line with `const API_BASE = ...`)
4. Deploy frontend files
5. Test everything works end-to-end

## 🎉 You're All Set!

Your backend is ready to receive subscribers and manage contact emails. Start using the admin dashboard to manage your customer interactions!

Need help? Check the README.md file for more detailed documentation.
