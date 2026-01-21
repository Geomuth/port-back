# Deployment Guide - TechGeo Backend

## Overview
This guide will help you deploy the TechGeo backend to production and make it publicly accessible.

## Options for Deployment

### 1. **Heroku** (Easiest for Beginners)

#### Prerequisites
- Heroku account (free): https://www.heroku.com/
- Heroku CLI installed

#### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd /home/geoffrey/Desktop/portofolia
   heroku create techgeo-api
   ```

3. **Create Procfile** (already not needed as Heroku detects Node.js)
   - Heroku automatically runs `npm start`

4. **Update package.json** (if not already)
   ```json
   "engines": {
     "node": "14.x"
   }
   ```

5. **Add MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Create free account and cluster
   - Get connection string
   - Set as Heroku config variable:
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techgeo
   heroku config:set JWT_SECRET=your_super_secret_key
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **View Logs**
   ```bash
   heroku logs --tail
   ```

Your app will be live at: `https://techgeo-api.herokuapp.com`

### 2. **AWS (EC2)**

#### Prerequisites
- AWS Account
- EC2 instance (t2.micro free tier)
- SSH access

#### Steps

1. **SSH into EC2**
   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
   sudo yum install nodejs npm
   ```

3. **Install MongoDB**
   ```bash
   wget https://repo.mongodb.org/yum/amazon/2/mongodb-org/5.0/x86_64/RPMS/mongodb-org-server-5.0.0-1.amzn2.x86_64.rpm
   sudo rpm -ivh mongodb-org-server-5.0.0-1.amzn2.x86_64.rpm
   sudo systemctl start mongod
   ```

4. **Clone Your Project**
   ```bash
   git clone your-repo-url
   cd portofolia
   npm install
   ```

5. **Set Environment Variables**
   ```bash
   export MONGODB_URI=mongodb://localhost:27017/techgeo
   export JWT_SECRET=your_secret
   export NODE_ENV=production
   export PORT=80
   ```

6. **Install PM2** (for process management)
   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name "techgeo-api"
   pm2 startup
   pm2 save
   ```

7. **Install Nginx** (reverse proxy)
   ```bash
   sudo amazon-linux-extras install nginx1 -y
   ```

8. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```
   Add to server block:
   ```nginx
   location / {
       proxy_pass http://localhost:5000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
   }
   ```

9. **Start Nginx**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

### 3. **DigitalOcean (Droplet)**

Similar to AWS, but simpler:

1. Create a $5/month droplet (Ubuntu 20.04)
2. SSH in and follow same steps as AWS
3. Use DigitalOcean's built-in SSL support

### 4. **Vercel** (Serverless)

#### Steps

1. **Convert to Serverless Format**
   - Move `server.js` logic to API routes
   - This requires refactoring

2. **Deploy**
   ```bash
   npm i -g vercel
   vercel
   ```

**Note**: Vercel is better for static sites and serverless functions

## Post-Deployment Configuration

### 1. **Update Frontend URLs**

In `index.html` and `public/admin-script.js`:
```javascript
const API_BASE = 'https://your-domain.com/api';
```

### 2. **Enable CORS for Your Domain**

In `server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-domain.com', 'http://localhost:3000'],
  credentials: true
}));
```

### 3. **Use SSL Certificate**

- Heroku: Automatic with `.herokuapp.com` domain
- AWS/DigitalOcean: Use Let's Encrypt Certbot
  ```bash
  sudo certbot certonly --nginx -d your-domain.com
  ```

### 4. **Set Up Custom Domain**

- Buy domain from GoDaddy, Namecheap, etc.
- Point DNS to your server
- Configure in Heroku/AWS/DigitalOcean

## Environment Variables for Production

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/techgeo
JWT_SECRET=use-a-very-long-random-string-here
PORT=5000
NODE_ENV=production
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Monitoring & Maintenance

### 1. **Set Up Logging**
- Heroku: `heroku logs --tail`
- AWS: CloudWatch Logs
- DigitalOcean: PM2 logs

### 2. **Monitor Database**
- MongoDB Atlas dashboard
- Set up alerts for storage

### 3. **Backup Data**
```bash
# Monthly backup command
mongodump --uri "your_connection_string" --out /backups/techgeo-$(date +%Y%m%d)
```

### 4. **Performance Monitoring**
- Add APM (Application Performance Monitoring)
- Consider New Relic or Datadog for paid options

## Security Checklist

- [ ] Change JWT_SECRET to random strong value
- [ ] Enable HTTPS/SSL
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your domain
- [ ] Add rate limiting
- [ ] Set up database backups
- [ ] Enable authentication on all protected routes
- [ ] Use strong MongoDB password
- [ ] Keep dependencies updated

## Common Issues

### "Cannot connect to MongoDB"
- Verify MONGODB_URI is correct
- Check MongoDB user has database access
- Ensure IP whitelist includes server IP (MongoDB Atlas)

### "CORS errors"
- Verify frontend domain is in CORS whitelist
- Check headers in server.js

### "Cannot find module"
```bash
npm install --production
npm install
```

### "Port already in use"
- Change PORT in .env
- Or kill process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

## Scaling for Production

When traffic grows:

1. **Use Connection Pooling** - MongoDB connection pool management
2. **Add Caching** - Redis for frequent queries
3. **Load Balancing** - Multiple server instances
4. **CDN** - CloudFlare for static assets
5. **Database Indexing** - Optimize MongoDB queries

## Monitoring Dashboard

For production systems, consider:
- **Uptime Robot**: Free uptime monitoring
- **New Relic**: Performance monitoring
- **Sentry**: Error tracking
- **LogRocket**: Session replay and logging

## Support & Troubleshooting

If deployment fails:

1. Check logs: `heroku logs --tail` or your server logs
2. Verify environment variables are set
3. Test API locally first
4. Check network connectivity (firewalls, security groups)
5. Review MongoDB connection string format

## Next Steps

1. Deploy to production
2. Set up custom domain
3. Configure SSL/HTTPS
4. Test all API endpoints
5. Set up monitoring
6. Create backup strategy

Good luck! 🚀
