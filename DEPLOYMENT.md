# HRMS Deployment Guide

## Prerequisites
- PostgreSQL database
- SMTP email service
- Node.js 16+ runtime
- Domain name (optional)

## Environment Variables Setup

Create a `.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=generate_a_secure_random_string
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# URLs
CLIENT_URL=https://your-domain.com
SERVER_URL=https://api.your-domain.com

# Company
COMPANY_NAME=Your Company Name
COMPANY_EMAIL=hr@yourcompany.com
```

## Deployment Platforms

### 1. Vercel (Recommended for quick deployment)

**Frontend Deployment:**
```bash
cd client
vercel --prod
```

**Backend Deployment:**
- Create a `vercel.json` in the root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/index.js"
    }
  ]
}
```
- Deploy: `vercel --prod`

### 2. Render

**Backend:**
1. Create new Web Service
2. Connect GitHub repository
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables from .env

**Frontend:**
1. Create new Static Site
2. Build Command: `cd client && npm install && npm run build`
3. Publish Directory: `client/dist`

**Database:**
1. Create PostgreSQL database on Render
2. Copy internal database URL
3. Update DB_HOST in environment variables

### 3. AWS Lightsail

**Setup:**
```bash
# SSH into instance
ssh user@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Clone repository
git clone your-repo-url
cd hrms

# Install dependencies
npm install
cd client && npm install && npm run build && cd ..

# Setup environment
cp .env.example .env
nano .env  # Edit with your values

# Run migrations
npm run migrate

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Digital Ocean

Similar to AWS Lightsail setup. Use their App Platform for easier deployment:

1. Create new App
2. Connect GitHub repository
3. Select Node.js
4. Configure environment variables
5. Add PostgreSQL database
6. Deploy

### 5. Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
# ... add all other env vars

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

### 6. cPanel Hosting

**Steps:**
1. Upload files via FTP or File Manager
2. Create PostgreSQL database in cPanel
3. Note database credentials
4. Install Node.js via Setup Node.js App
5. Set application root and startup file
6. Add environment variables
7. Install dependencies via cPanel terminal
8. Start application

**Setup Script:**
```bash
cd /home/username/public_html/hrms
npm install
cd client && npm install && npm run build && cd ..
node server/migrations/run.js
```

## Post-Deployment Checklist

### 1. Database Setup
```bash
# Run migrations
npm run migrate

# Create admin user
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@company.com",
    "password": "secure_password",
    "role": "admin"
  }'
```

### 2. Email Testing
- Send test application
- Verify emails are received
- Check spam folder if missing

### 3. File Upload Testing
- Test resume upload
- Verify file size limits
- Check file storage location

### 4. Security Checks
- Verify HTTPS is enabled
- Check CORS settings
- Test rate limiting
- Review exposed endpoints

### 5. Performance Optimization
- Enable gzip compression
- Set up CDN for static files
- Configure database connection pooling
- Enable caching headers

## Monitoring

### Log Management
```bash
# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f

# Custom logging
# Check logs/ directory
```

### Health Checks
```bash
# Check API health
curl https://your-api-url/health

# Check database connection
curl https://your-api-url/api/dashboard/overview
```

## Backup Strategy

### Database Backup
```bash
# PostgreSQL backup
pg_dump -U username dbname > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * pg_dump -U username dbname > /backups/backup_$(date +\%Y\%m\%d).sql
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

## SSL Certificate

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Run multiple instances with PM2 cluster mode
- Share session state via Redis

### Database Scaling
- Enable connection pooling
- Add read replicas
- Implement caching (Redis)

### File Storage Scaling
- Use AWS S3 or similar
- Implement CDN for file delivery

## Troubleshooting

### Application won't start
- Check logs: `pm2 logs` or `docker-compose logs`
- Verify environment variables
- Check database connection

### 502 Bad Gateway
- Check if application is running
- Verify port numbers
- Check Nginx/proxy configuration

### Database connection errors
- Verify database is running
- Check connection credentials
- Ensure database accepts connections from app server

### Email not sending
- Verify SMTP credentials
- Check firewall rules for SMTP ports
- Test with different email provider

## Support

For deployment issues, please check:
1. Application logs
2. Server logs
3. Database logs
4. Network connectivity
5. Environment variables

Contact: support@yourcompany.com
