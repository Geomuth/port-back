# TechGeo Admin Dashboard Backend

A complete backend system for managing subscribers and emails for the TechGeo portfolio website. This system provides an admin dashboard to view subscribers and manage incoming email inquiries.

## Features

- **Subscriber Management**: Track and manage newsletter subscribers
- **Email Management**: Receive, view, and reply to contact form inquiries
- **Admin Authentication**: Secure login/registration for admin users
- **Dashboard**: Real-time overview of subscribers and emails with statistics
- **Email Replies**: Send replies directly from the dashboard
- **RESTful API**: Complete API for all operations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Edit `.env` file with your settings:
   ```
   MONGODB_URI=mongodb://localhost:27017/techgeo
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=development
   ```

3. **Start MongoDB**
   ```bash
   # If MongoDB is installed locally
   mongod
   ```

4. **Start the Backend Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

The server will run on `http://localhost:5000`

## Usage

### Access Admin Dashboard

1. Open your browser and navigate to: `http://localhost:5000/admin.html`
2. Register a new admin account or login if you already have one
3. Use the dashboard to manage subscribers and emails

### Frontend Integration

To integrate the subscriber and email endpoints into your main website:

#### Subscribe to Newsletter
```javascript
fetch('http://localhost:5000/api/subscribers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe'
  })
})
```

#### Submit Contact Form
```javascript
fetch('http://localhost:5000/api/emails', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    subject: 'Service Inquiry',
    message: 'I am interested in your services...'
  })
})
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Login admin

### Subscribers
- `GET /api/subscribers` - Get all subscribers (requires auth)
- `POST /api/subscribers` - Add new subscriber
- `DELETE /api/subscribers/:id` - Delete subscriber (requires auth)
- `GET /api/subscribers/stats/overview` - Get subscriber statistics (requires auth)

### Emails
- `GET /api/emails` - Get all emails (requires auth)
- `GET /api/emails/new/list` - Get new emails (requires auth)
- `POST /api/emails` - Submit new email
- `PATCH /api/emails/:id/read` - Mark email as read (requires auth)
- `PATCH /api/emails/:id/reply` - Send reply (requires auth)
- `DELETE /api/emails/:id` - Delete email (requires auth)
- `GET /api/emails/stats/overview` - Get email statistics (requires auth)

## Project Structure

```
portofolia/
├── server.js              # Main server file
├── package.json           # Dependencies
├── .env                   # Environment variables
├── models/
│   ├── Subscriber.js      # Subscriber schema
│   ├── Email.js           # Email schema
│   └── Admin.js           # Admin user schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── subscribers.js      # Subscriber routes
│   └── emails.js          # Email routes
├── middleware/
│   └── auth.js            # JWT authentication middleware
└── public/
    ├── admin.html         # Admin dashboard HTML
    ├── admin-style.css    # Dashboard CSS
    └── admin-script.js    # Dashboard JavaScript
```

## Database Models

### Subscriber
- `email`: String (unique, required)
- `name`: String
- `subscribedAt`: Date
- `isActive`: Boolean

### Email
- `senderName`: String
- `senderEmail`: String
- `subject`: String
- `message`: String (required)
- `receivedAt`: Date
- `isReplied`: Boolean
- `replyMessage`: String
- `repliedAt`: Date
- `status`: String (new/read/replied)

### Admin
- `username`: String (unique, required)
- `email`: String (unique, required)
- `password`: String (hashed)
- `createdAt`: Date

## Security Notes

1. Change the JWT_SECRET in .env to a strong, unique value
2. Use HTTPS in production
3. Implement rate limiting on public endpoints
4. Store sensitive data securely
5. Validate all inputs on the backend
6. Use CORS carefully in production

## Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify MongoDB connection string format

### "Port 5000 already in use"
- Change PORT in .env file
- Or kill the process using port 5000

### "CORS errors"
- Check CORS configuration in server.js
- Ensure frontend URL is properly configured

## Future Enhancements

- Email notifications for new messages
- Bulk email sending to subscribers
- Email templates
- Advanced search and filtering
- Email scheduling
- Integration with email services (SendGrid, etc.)
- Analytics and reporting
- User activity logs

## License

ISC

## Author

Geoffrey Muthoka
