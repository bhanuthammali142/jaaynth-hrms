# 🚀 Quick Deployment Guide for HRMS

## Choose Your Deployment Method

I'll guide you through the **easiest and fastest** deployment options:

---

## Option 1: Render (Recommended - Easiest!) ⭐

**Why Render?**
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in PostgreSQL database
- ✅ HTTPS included
- ✅ Zero configuration needed

### Step-by-Step:

#### A. Deploy Database (5 minutes)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - Name: `hrms-database`
   - Database: `hrms_db`
   - User: `hrms_user`
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. **Copy the "Internal Database URL"** - you'll need this!

#### B. Deploy Backend (5 minutes)

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub: `bhanuthammali142/jaaynth-hrms`
3. Configure:
   - **Name**: `hrms-api`
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free

4. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=<paste your Internal Database URL from step A>
   JWT_SECRET=<run: openssl rand -base64 32>
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   CLIENT_URL=<will add after frontend is deployed>
   SERVER_URL=<will be: https://hrms-api.onrender.com>
   COMPANY_NAME=Your Company Name
   COMPANY_EMAIL=hr@yourcompany.com
   ```

5. Click **"Create Web Service"**

6. **Run Migrations** (after deployment):
   - Go to Shell tab in Render dashboard
   - Run: `npm run migrate`

#### C. Deploy Frontend (5 minutes)

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repo
3. Configure:
   - **Name**: `hrms-app`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `client/dist`

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://hrms-api.onrender.com/api
   ```

5. Click **"Create Static Site"**

#### D. Update Backend with Frontend URL

1. Go back to your backend service
2. Update environment variable:
   ```
   CLIENT_URL=https://hrms-app.onrender.com
   ```
3. Click **"Save Changes"** (will auto-redeploy)

### ✅ Done! Your app is live at:
- **Frontend**: `https://hrms-app.onrender.com`
- **Backend**: `https://hrms-api.onrender.com`

---

## Option 2: Railway (Super Fast!) 🚄

**Why Railway?**
- ✅ Fastest deployment
- ✅ One command setup
- ✅ Built-in PostgreSQL
- ✅ $5 free credit

### Step-by-Step:

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Initialize project:
   ```bash
   cd /workspaces/jaaynth-hrms
   railway init
   ```

4. Add PostgreSQL:
   ```bash
   railway add postgres
   ```

5. Deploy:
   ```bash
   railway up
   ```

6. Set environment variables:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=$(openssl rand -base64 32)
   railway variables set SMTP_HOST=smtp.gmail.com
   railway variables set SMTP_PORT=587
   railway variables set SMTP_USER=your_email@gmail.com
   railway variables set SMTP_PASSWORD=your_app_password
   railway variables set COMPANY_NAME="Your Company"
   railway variables set COMPANY_EMAIL=hr@yourcompany.com
   ```

7. Run migrations:
   ```bash
   railway run npm run migrate
   ```

8. Get your URL:
   ```bash
   railway domain
   ```

### ✅ Done! Copy the URL and test!

---

## Option 3: DigitalOcean App Platform 🌊

**Why DigitalOcean?**
- ✅ Professional grade
- ✅ $200 free credit for 60 days
- ✅ Easy scaling
- ✅ Great docs

### Step-by-Step:

1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Click **"Create"** → **"Apps"**
3. Connect GitHub: `bhanuthammali142/jaaynth-hrms`
4. Configure:
   - Detect: Web Service (backend)
   - Add Static Site (frontend)
5. Add PostgreSQL database
6. Set environment variables (same as Render)
7. Click **"Launch App"**

### ✅ Done in 10 minutes!

---

## Option 4: Docker + VPS (Advanced) 🐳

If you have your own server (AWS, DigitalOcean Droplet, etc.):

### Quick Commands:

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Clone repo
git clone https://github.com/bhanuthammali142/jaaynth-hrms.git
cd jaaynth-hrms

# 3. Create .env file
cp .env.example .env
nano .env  # Edit with your values

# 4. Deploy with Docker
docker-compose up -d

# 5. Run migrations
docker-compose exec web npm run migrate

# 6. Check status
docker-compose ps
```

Your app will be running at `http://your-server-ip:5000`

---

## 🔑 Getting SMTP Credentials (Gmail)

For email functionality:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security** → **2-Step Verification** (enable it)
3. **Security** → **App passwords**
4. Select app: **Mail**, Device: **Other** (type "HRMS")
5. Click **Generate**
6. **Copy the 16-character password** (use this as SMTP_PASSWORD)

---

## 🔐 Generate JWT Secret

Run this command:
```bash
openssl rand -base64 32
```

Copy the output and use it as your `JWT_SECRET`

---

## ✅ Post-Deployment Checklist

After deployment:

### 1. Create Admin User
```bash
curl -X POST https://your-api-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@yourcompany.com",
    "password": "ChangeThisPassword123!",
    "role": "admin"
  }'
```

### 2. Test Login
- Go to your frontend URL
- Login with admin credentials
- Change password immediately in Settings

### 3. Test Features
- [ ] Create a test job
- [ ] Submit a test application
- [ ] Check if email arrives
- [ ] Schedule a test interview
- [ ] Create a test offer

### 4. Configure DNS (Optional)
Point your domain to your deployment:
- **Render**: Add custom domain in settings
- **Railway**: `railway domain add yourdomain.com`
- **DigitalOcean**: Add domain in DNS settings

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is set correctly
- Ensure database is running
- Run migrations: `npm run migrate`

### "CORS errors"
- Update CLIENT_URL in backend environment
- Update SERVER_URL in backend environment
- Redeploy both frontend and backend

### "Emails not sending"
- Verify SMTP credentials
- Check Gmail app password (not regular password)
- Enable "Less secure app access" if needed

### "Build failed"
- Check build logs in platform dashboard
- Ensure all dependencies in package.json
- Try building locally first: `npm run build`

---

## 📊 Monitoring

After deployment, monitor your app:

### Render
- View logs in dashboard
- Check metrics
- Set up alerts

### Railway
```bash
railway logs
```

### Docker
```bash
docker-compose logs -f
```

---

## 💰 Cost Estimates

### Free Options:
- **Render**: Free tier (spins down after inactivity)
- **Railway**: $5 free credit/month
- **Vercel**: Free for frontend

### Paid Options (if scaling):
- **Render**: $7/month (Web Service) + $7/month (PostgreSQL)
- **Railway**: ~$5-15/month depending on usage
- **DigitalOcean**: $12/month (App) + $7/month (Database)
- **VPS**: $5-10/month (DigitalOcean Droplet)

---

## 🎯 My Recommendation

**For beginners**: Use **Render** (Option 1)
- Easiest setup
- Free tier
- All-in-one solution

**For developers**: Use **Railway** (Option 2)
- Fastest deployment
- Great CLI
- Simple commands

**For production**: Use **DigitalOcean** (Option 3)
- Professional grade
- Better performance
- Scalable

**For experts**: Use **Docker + VPS** (Option 4)
- Full control
- Cheapest long-term
- Most flexible

---

## 🚀 Quick Start (Render - 15 minutes)

Copy-paste this checklist:

- [ ] Sign up at render.com
- [ ] Create PostgreSQL database
- [ ] Copy Internal Database URL
- [ ] Create Web Service for backend
- [ ] Paste environment variables
- [ ] Deploy backend
- [ ] Run migrations in Shell
- [ ] Create Static Site for frontend
- [ ] Add VITE_API_URL variable
- [ ] Deploy frontend
- [ ] Update CLIENT_URL in backend
- [ ] Create admin user via curl
- [ ] Login and test!

---

## 📞 Need Help?

1. Check logs in your platform dashboard
2. Review TROUBLESHOOTING.md
3. Check DEPLOYMENT.md for detailed guides
4. Verify all environment variables are set

---

**Ready to deploy? Pick an option above and follow the steps!** 🚀

Your app is fully tested and production-ready. Good luck! 🎉
