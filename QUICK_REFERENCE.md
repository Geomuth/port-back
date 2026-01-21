# 🚀 Quick Reference Card

## Start Backend (3 steps)

```bash
# 1. Install
npm install

# 2. Start MongoDB (choose one)
docker run -d -p 27017:27017 --name mongodb mongo:latest
# OR
mongod
# OR update .env with MongoDB Atlas URL

# 3. Start Server
npm start
```

Server runs on: **http://localhost:5000**

---

## Access Admin Dashboard

**URL:** http://localhost:5000/admin.html

1. Click "Register" → Create account
2. Login with credentials
3. Start managing!

---

## API Endpoints Quick Reference

### Public (No Auth)
```
POST /api/subscribers
POST /api/emails
```

### Admin (Requires Login)
```
GET  /api/subscribers
GET  /api/emails
GET  /api/emails/new/list
PATCH /api/emails/:id/reply
POST /api/auth/login
POST /api/auth/register
```

---

## Frontend Integration

Already done in `index.html`:
- Newsletter subscribe button → sends to backend
- Contact form → sends to backend
- Automatically posts to `/api/subscribers` and `/api/emails`

---

## Folder Purpose

| Folder | Purpose |
|--------|---------|
| `/models` | Database schemas (Subscriber, Email, Admin) |
| `/routes` | API endpoints (auth, subscribers, emails) |
| `/middleware` | JWT authentication |
| `/public` | Admin dashboard HTML/CSS/JS |

---

## Important Config Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (MongoDB URI, JWT secret) |
| `package.json` | Node dependencies |
| `server.js` | Main server setup |

---

## Documentation Files

| File | Read For... |
|------|-----------|
| `INDEX.md` | Overall overview |
| `README.md` | Full API docs |
| `SETUP.md` | Local setup help |
| `DEPLOYMENT.md` | Deploy to production |
| `API_EXAMPLES.js` | Code examples |

---

## Testing Endpoints

### Test Subscribe
```bash
curl -X POST http://localhost:5000/api/subscribers \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test"}'
```

### Test Email Submit
```bash
curl -X POST http://localhost:5000/api/emails \
  -H "Content-Type: application/json" \
  -d '{"senderName":"John","senderEmail":"john@test.com","subject":"Test","message":"Hi"}'
```

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Stop server
Ctrl + C

# Check if port is in use
lsof -i :5000

# Kill process on port 5000
kill -9 <PID>

# View MongoDB
mongosh  # if installed locally

# Clear console
clear

# List directory
ls -la
```

---

## Environment Variables (.env)

```
MONGODB_URI=mongodb://localhost:27017/techgeo
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

---

## File Structure

```
portofolia/
├── server.js          ← Main server
├── package.json       ← Dependencies
├── .env              ← Configuration
├── models/           ← Database schemas
├── routes/           ← API endpoints
├── middleware/       ← Authentication
├── public/           ← Admin dashboard
└── index.html        ← Frontend (updated)
```

---

## Features

### Admin Dashboard
✅ Login/Register
✅ View subscribers
✅ View emails
✅ Reply to emails
✅ Delete items
✅ Statistics display

### Website Features
✅ Newsletter subscribe
✅ Contact form
✅ Data stored in database
✅ Admin management

---

## Deployment Steps

1. Set up database (MongoDB Atlas recommended)
2. Choose hosting (Heroku easiest)
3. Follow DEPLOYMENT.md
4. Update API URLs
5. Deploy!

---

## Problem Solver

| Problem | Solution |
|---------|----------|
| MongoDB won't connect | Check MONGODB_URI in .env, ensure MongoDB is running |
| Port 5000 in use | Change PORT in .env or kill process |
| Forms not working | Check console errors, verify API_BASE URL |
| Dashboard won't load | Check browser console, verify server is running |
| Admin can't login | Verify credentials, check if user exists |

---

## Key Credentials

After registration, you'll have:
- **Username:** (what you entered)
- **Email:** (what you entered)
- **Password:** (what you entered)

Store safely! This is your admin access.

---

## Next Actions

- [ ] Run: `npm install`
- [ ] Set up MongoDB
- [ ] Run: `npm start`
- [ ] Visit: http://localhost:5000/admin.html
- [ ] Register admin account
- [ ] Test subscribe & contact forms
- [ ] Check dashboard
- [ ] Ready to deploy!

---

**Everything is set up and ready to go!** 🎉

Questions? Check the documentation files in the project folder.
