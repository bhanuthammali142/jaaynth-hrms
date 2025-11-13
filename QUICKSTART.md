# Quick Start Guide

## Option 1: Automated Setup (Linux/Mac)

```bash
chmod +x setup.sh
./setup.sh
```

## Option 2: Automated Setup (Windows)

```cmd
setup.bat
```

## Option 3: Manual Setup

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Setup Database
```bash
# Create database
psql -U postgres -c "CREATE DATABASE hrms_db;"

# Run migrations
npm run migrate
```

### 4. Create Admin User
```bash
# Start server
npm run server

# In another terminal
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@company.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### 5. Start Application
```bash
npm run dev
```

Visit: http://localhost:5173

## Default Credentials

Email: admin@company.com
Password: admin123

⚠️ Change these in production!

## Quick Test

1. Login with admin credentials
2. Create a new job posting
3. Share the application link
4. Submit a test application
5. Manage from the dashboard

## Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3000
```

**Database connection error:**
- Verify PostgreSQL is running
- Check credentials in .env
- Ensure database exists

**Email not working:**
- Use Gmail App Password
- Check SMTP settings
- Test with a different email service

## Need Help?

Check the full documentation:
- README.md - Complete guide
- DEPLOYMENT.md - Deployment instructions
- GitHub Issues - Report bugs
