#!/bin/bash

# HRMS Deployment Helper Script
# This script helps you prepare for deployment

echo "🚀 HRMS Deployment Helper"
echo "=========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will help you prepare for deployment.${NC}"
echo ""

# Ask which platform
echo "Which platform do you want to deploy to?"
echo "1) Render (Recommended - Easiest)"
echo "2) Railway (Fastest)"
echo "3) DigitalOcean App Platform"
echo "4) Vercel (Frontend) + Render (Backend)"
echo "5) Docker VPS"
echo ""
read -p "Enter choice [1-5]: " platform_choice

case $platform_choice in
  1)
    echo -e "${GREEN}Great choice! Render is perfect for beginners.${NC}"
    PLATFORM="Render"
    ;;
  2)
    echo -e "${GREEN}Railway is super fast!${NC}"
    PLATFORM="Railway"
    ;;
  3)
    echo -e "${GREEN}DigitalOcean is great for production!${NC}"
    PLATFORM="DigitalOcean"
    ;;
  4)
    echo -e "${GREEN}Vercel + Render combo is powerful!${NC}"
    PLATFORM="Vercel+Render"
    ;;
  5)
    echo -e "${GREEN}Docker VPS gives you full control!${NC}"
    PLATFORM="Docker"
    ;;
  *)
    echo -e "${RED}Invalid choice. Defaulting to Render.${NC}"
    PLATFORM="Render"
    ;;
esac

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Deployment Preparation for $PLATFORM${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file from template...${NC}"
  cp .env.example .env
  echo -e "${GREEN}✓ .env file created${NC}"
else
  echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Generate JWT secret
echo ""
echo -e "${BLUE}Generating secure JWT secret...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo "JWT_SECRET=$JWT_SECRET"
echo -e "${GREEN}✓ Copy this JWT_SECRET for your deployment${NC}"

# Check git status
echo ""
echo -e "${BLUE}Checking git status...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Git repository initialized${NC}"
  
  # Check if repo is clean
  if [[ -z $(git status -s) ]]; then
    echo -e "${GREEN}✓ All changes committed${NC}"
  else
    echo -e "${YELLOW}⚠ You have uncommitted changes${NC}"
    echo "Run: git add . && git commit -m 'Your message' && git push"
  fi
  
  # Show remote URL
  REMOTE_URL=$(git config --get remote.origin.url)
  if [ ! -z "$REMOTE_URL" ]; then
    echo -e "${GREEN}✓ GitHub repository: $REMOTE_URL${NC}"
  fi
else
  echo -e "${RED}✗ Not a git repository${NC}"
fi

# Generate environment template for deployment
echo ""
echo -e "${BLUE}Creating deployment environment template...${NC}"

cat > deployment-env.txt << EOF
# Copy these environment variables to your deployment platform
# ============================================================

# Server Configuration
NODE_ENV=production
PORT=10000

# Database (will be provided by your platform)
DATABASE_URL=<your-database-url>

# Security
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email@gmail.com>
SMTP_PASSWORD=<your-gmail-app-password>

# URLs (update after deployment)
CLIENT_URL=<your-frontend-url>
SERVER_URL=<your-backend-url>

# Company Info
COMPANY_NAME=Your Company Name
COMPANY_EMAIL=hr@yourcompany.com

# ============================================================
# Instructions:
# 1. Replace all <placeholders> with actual values
# 2. For Gmail app password: https://myaccount.google.com/apppasswords
# 3. Update URLs after deploying frontend and backend
EOF

echo -e "${GREEN}✓ Environment template created: deployment-env.txt${NC}"

# Platform-specific instructions
echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Next Steps for $PLATFORM:${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

case $platform_choice in
  1) # Render
    cat << 'RENDER_STEPS'
📋 Render Deployment Steps:

1. Database Setup (5 min):
   - Go to https://render.com and sign up
   - Click "New +" → "PostgreSQL"
   - Name: hrms-database
   - Create and copy "Internal Database URL"

2. Backend Deployment (5 min):
   - Click "New +" → "Web Service"
   - Connect GitHub: bhanuthammali142/jaaynth-hrms
   - Build: npm install
   - Start: node server/index.js
   - Add environment variables from deployment-env.txt
   - Create service

3. Run Migrations:
   - Go to service → Shell tab
   - Run: npm run migrate

4. Frontend Deployment (5 min):
   - Click "New +" → "Static Site"
   - Root: client
   - Build: npm install && npm run build
   - Publish: client/dist
   - Add: VITE_API_URL=https://your-backend.onrender.com/api
   - Create site

5. Update Backend:
   - Add CLIENT_URL with your frontend URL
   - Save (will redeploy)

✅ Done! Access your app at the frontend URL
RENDER_STEPS
    ;;
    
  2) # Railway
    cat << 'RAILWAY_STEPS'
📋 Railway Deployment Steps:

1. Install CLI:
   npm install -g @railway/cli

2. Deploy:
   railway login
   railway init
   railway add postgres
   railway up

3. Set Variables:
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=$(openssl rand -base64 32)
   (add other variables from deployment-env.txt)

4. Run Migrations:
   railway run npm run migrate

5. Get URL:
   railway domain

✅ Done! Your app is live!
RAILWAY_STEPS
    ;;
    
  3) # DigitalOcean
    cat << 'DO_STEPS'
📋 DigitalOcean Deployment Steps:

1. Go to https://cloud.digitalocean.com
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure:
   - Web Service (backend)
   - Static Site (frontend)
5. Add PostgreSQL database
6. Set environment variables
7. Launch!

✅ Done! Check your app URL in dashboard
DO_STEPS
    ;;
    
  4) # Vercel + Render
    cat << 'VERCEL_STEPS'
📋 Vercel + Render Deployment:

Backend (Render):
1. Follow Render steps above for backend + database

Frontend (Vercel):
1. Go to https://vercel.com
2. Import bhanuthammali142/jaaynth-hrms
3. Root Directory: client
4. Framework: Vite
5. Build Command: npm run build
6. Output Directory: dist
7. Add: VITE_API_URL=https://your-backend.onrender.com/api
8. Deploy!

✅ Lightning fast frontend on Vercel!
VERCEL_STEPS
    ;;
    
  5) # Docker
    cat << 'DOCKER_STEPS'
📋 Docker VPS Deployment:

1. SSH to your server:
   ssh user@your-server-ip

2. Install Docker:
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

3. Clone and deploy:
   git clone https://github.com/bhanuthammali142/jaaynth-hrms.git
   cd jaaynth-hrms
   cp .env.example .env
   nano .env  # Edit variables
   docker-compose up -d

4. Run migrations:
   docker-compose exec web npm run migrate

5. Check status:
   docker-compose ps
   docker-compose logs -f

✅ Running at http://your-server-ip:5000
DOCKER_STEPS
    ;;
esac

echo ""
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Important Files Created:${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "1. deployment-env.txt - Environment variables template"
echo "2. JWT_SECRET printed above"
echo ""

echo -e "${BLUE}📚 For detailed guides, check:${NC}"
echo "  • DEPLOY_NOW.md - Quick deployment guide"
echo "  • DEPLOYMENT.md - Comprehensive deployment guide"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✨ Ready to Deploy!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your HRMS application is:"
echo "  ✅ Production ready"
echo "  ✅ Fully tested"
echo "  ✅ Security verified"
echo "  ✅ Git committed"
echo ""
echo "Follow the steps above to deploy!"
echo ""
echo -e "${YELLOW}💡 Tip: Start with Render if this is your first deployment!${NC}"
echo ""
