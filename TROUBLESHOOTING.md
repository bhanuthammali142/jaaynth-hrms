# 🔧 Troubleshooting Guide

Quick reference for common issues and solutions.

---

## Quick Diagnostics

Run this command to validate your setup:
```bash
./test.sh
```

---

## Common Issues & Solutions

### 1. Server Won't Start

**Symptom**: Error when running `npm start` or `npm run dev`

**Possible Causes**:

#### A. Port 5000 already in use
```bash
# Check what's using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5001 npm start
```

#### B. Missing dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### C. Database connection failed
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Start if stopped
sudo service postgresql start

# Verify credentials in .env
nano .env
```

---

### 2. Database Errors

**Symptom**: "Cannot connect to database" or migration fails

**Solutions**:

#### A. Database doesn't exist
```bash
# Create database
createdb hrms_db

# Or with custom user
createdb -U postgres hrms_db
```

#### B. Wrong credentials
```env
# Verify in .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=your_username
DB_PASSWORD=your_password
```

#### C. PostgreSQL not accepting connections
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Add this line:
local   all   all   trust

# Restart PostgreSQL
sudo service postgresql restart
```

#### D. Run migrations
```bash
# If tables don't exist
npm run migrate
```

---

### 3. Frontend Build Errors

**Symptom**: `npm run dev` fails in client directory

**Solutions**:

#### A. Missing dependencies
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

#### B. Port 5173 in use
```bash
# Check what's using port
lsof -i :5173

# Kill or use different port
vite --port 3000
```

#### C. Vite config error
```bash
# Verify vite.config.js exists
ls client/vite.config.js

# Check syntax
cat client/vite.config.js
```

---

### 4. Authentication Issues

**Symptom**: Login fails or "Invalid token" errors

**Solutions**:

#### A. JWT_SECRET not set
```env
# Add to .env
JWT_SECRET=your_super_secret_key_here_at_least_32_chars
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

#### B. Token expired
- Clear browser localStorage
- Login again

#### C. Wrong credentials
```bash
# Create admin user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
  }'
```

---

### 5. File Upload Fails

**Symptom**: Resume upload returns error

**Solutions**:

#### A. Uploads directory missing
```bash
mkdir -p uploads
chmod 755 uploads
```

#### B. File too large
- Max size: 5MB
- Compress or use smaller file

#### C. Invalid file type
Allowed types: PDF, DOC, DOCX

#### D. Permission denied
```bash
# Fix permissions
chmod 755 uploads
```

---

### 6. Emails Not Sending

**Symptom**: Email functions return error or emails not received

**Solutions**:

#### A. SMTP not configured
```env
# Add to .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

#### B. Gmail App Password needed
1. Go to Google Account settings
2. Enable 2FA
3. Generate App Password
4. Use App Password in .env

#### C. Firewall blocking SMTP
```bash
# Check firewall
sudo ufw status

# Allow SMTP ports
sudo ufw allow 587
sudo ufw allow 465
```

#### D. Test email manually
```bash
curl -X POST http://localhost:5000/api/applications/apply/JOB_ID \
  -F "candidateName=Test User" \
  -F "candidateEmail=test@example.com" \
  -F "resume=@resume.pdf"
```

---

### 7. CORS Errors

**Symptom**: Browser console shows CORS errors

**Solutions**:

#### A. Wrong CLIENT_URL
```env
# In .env
CLIENT_URL=http://localhost:5173
```

#### B. Credentials not set
Check `server/index.js` has:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
```

#### C. Multiple origins
```javascript
// Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://your-domain.com'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

### 8. Route Not Found (404)

**Symptom**: API returns 404 for valid routes

**Solutions**:

#### A. Check route path
```bash
# Test with curl
curl http://localhost:5000/api/jobs
curl http://localhost:5000/health
```

#### B. Server not running
```bash
# Check process
ps aux | grep node

# Restart server
npm run dev
```

#### C. Wrong base URL
Verify in `client/src/utils/api.js`:
```javascript
baseURL: '/api'  // For development with proxy
// or
baseURL: 'http://localhost:5000/api'  // Direct
```

---

### 9. Build Fails

**Symptom**: `npm run build` returns errors

**Solutions**:

#### A. TypeScript errors (if any)
```bash
# Install missing types
npm install --save-dev @types/node
```

#### B. Import errors
- Check all imports use correct paths
- Case-sensitive filenames

#### C. Environment variables
```bash
# Client needs VITE_ prefix
VITE_API_URL=https://api.yoursite.com
```

---

### 10. Deployment Issues

**Symptom**: App works locally but not in production

**Solutions**:

#### A. Environment variables not set
```bash
# Verify all env vars on server
echo $DB_HOST
echo $JWT_SECRET
```

#### B. Database connection string
```env
# Use full connection string
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

#### C. Static files not served
```javascript
// In server/index.js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}
```

#### D. Build production client
```bash
cd client
npm run build
```

---

## Error Code Reference

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request body/params |
| 401 | Unauthorized | Login or check token |
| 403 | Forbidden | Check user role |
| 404 | Not Found | Check route path |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Check server logs |

---

## Useful Commands

### Check Logs
```bash
# Server logs
npm run server

# PM2 logs
pm2 logs

# Docker logs
docker-compose logs -f

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

### Database Commands
```bash
# Connect to database
psql -U postgres -d hrms_db

# List tables
\dt

# Describe table
\d users

# Check table contents
SELECT * FROM users LIMIT 5;

# Drop and recreate
DROP DATABASE hrms_db;
CREATE DATABASE hrms_db;
npm run migrate
```

### Clear Everything
```bash
# Clear node modules
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json

# Clear uploads
rm -rf uploads/*
touch uploads/.gitkeep

# Clear browser data
# Open DevTools > Application > Clear Storage

# Fresh install
npm install
cd client && npm install
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Get jobs (with token)
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Performance Optimization

### Slow Queries
```sql
-- Add indexes
CREATE INDEX idx_applications_score ON applications(score);
CREATE INDEX idx_applications_created_at ON applications(created_at);
```

### High Memory Usage
```javascript
// Increase connection pool
max: 50,  // in database.js
```

### Slow Frontend
```bash
# Analyze bundle size
cd client
npm run build -- --mode analyze

# Enable compression
npm install compression
```

---

## Security Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Update default admin password
- [ ] Enable firewall
- [ ] Regular backups
- [ ] Update dependencies: `npm audit fix`
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] File upload restrictions working

---

## Getting Help

1. **Check this guide first**
2. **Run test script**: `./test.sh`
3. **Check logs** for specific errors
4. **Review documentation**:
   - README.md
   - API.md
   - DEPLOYMENT.md
   - TESTING_REPORT.md
5. **Check .env configuration**

---

## Still Having Issues?

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Or specific namespace
DEBUG=express:* npm start
```

### Health Check
```bash
# Quick status check
curl http://localhost:5000/health

# Database connection
npm run migrate

# Test email (check console)
# Submit test application and watch logs
```

### Clean Slate
```bash
# Complete reset
rm -rf node_modules client/node_modules
rm package-lock.json client/package-lock.json
npm install
cd client && npm install && cd ..
npm run migrate
npm run dev
```

---

**Remember**: 90% of issues are configuration-related. Check `.env` first!

---

*Last Updated: November 13, 2025*
