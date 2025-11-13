# HRMS - Human Resource Management & Recruitment Automation System

A comprehensive, secure, and scalable HRMS web application with recruitment automation features.

## 🚀 Features

- **Job Management**: Create and manage job postings with drag-and-drop form builder
- **Application Tracking**: Collect, filter, and manage candidate applications
- **Auto-scoring**: Automatically score applications based on criteria
- **Interview Scheduling**: Schedule and manage interviews with calendar integration
- **Offer Management**: Generate and track offer letters
- **Email Automation**: Automated notifications for all stages
- **Secure Authentication**: JWT-based auth with role-based access control
- **Responsive UI**: Modern, mobile-friendly interface

## 📋 Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- Nodemailer for emails
- Multer for file uploads

### Frontend
- React with React Router
- TailwindCSS for styling
- Axios for API calls
- React DnD for form builder

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd jaaynth-hrms
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hrms_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key

# Email (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# URLs
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

4. **Create PostgreSQL database**
```bash
psql -U postgres
CREATE DATABASE hrms_db;
\q
```

5. **Run database migrations**
```bash
npm run migrate
```

6. **Create admin user** (Run this in a separate terminal after starting the server)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@company.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 🚀 Running the Application

### Development Mode
```bash
# Run both backend and frontend
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Mode
```bash
# Build frontend
npm run build

# Start server
npm start
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t hrms-app .

# Run container
docker run -p 5000:5000 --env-file .env hrms-app
```

## 📦 Deployment Options

### 1. Vercel (Frontend + API)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Render
1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### 3. AWS Lightsail
1. Create new instance
2. Upload project files
3. Install dependencies and build
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
```

### 4. cPanel
1. Upload files via FTP or File Manager
2. Create PostgreSQL database via cPanel
3. Install Node.js via cPanel
4. Configure environment variables
5. Start application using Node.js Selector

## 📚 API Documentation

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user
```

### Jobs
```
GET /api/jobs - List all jobs
POST /api/jobs - Create new job (HR/Admin)
GET /api/jobs/:id - Get job details
PUT /api/jobs/:id - Update job (HR/Admin)
DELETE /api/jobs/:id - Delete job (Admin)
```

### Applications
```
POST /api/applications/apply/:jobId - Submit application (Public)
GET /api/applications - List applications (HR/Admin)
GET /api/applications/:id - Get application details (HR/Admin)
PATCH /api/applications/:id/status - Update status (HR/Admin)
```

### Interviews
```
GET /api/interviews - List interviews (HR/Admin)
POST /api/interviews - Schedule interview (HR/Admin)
PATCH /api/interviews/:id/status - Update status (HR/Admin)
```

### Offers
```
GET /api/offers - List offers (HR/Admin)
POST /api/offers - Create offer (HR/Admin)
PATCH /api/offers/respond/:id - Accept/Reject offer (Public)
```

### Dashboard
```
GET /api/dashboard/overview - Get statistics (HR/Admin)
GET /api/dashboard/recent-activity - Get recent activity (HR/Admin)
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload validation (type and size)
- CORS configuration
- Helmet.js security headers
- SQL injection prevention
- XSS protection

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use in SMTP_PASSWORD

### SendGrid Setup
1. Create SendGrid account
2. Generate API key
3. Set SENDGRID_API_KEY in .env

## 🎯 Usage Guide

### Creating a Job
1. Login as HR/Admin
2. Navigate to Jobs → Create New Job
3. Fill in job details
4. Use form builder to add custom fields
5. Publish and share the application link

### Managing Applications
1. View all applications in Applications tab
2. Filter by job, status, or search
3. Click on application to view details
4. Update status, schedule interviews, or send offers

### Interview Process
1. From application detail, click Schedule Interview
2. Set date, time, and meeting link
3. Email automatically sent to candidate
4. Mark as completed after interview

### Sending Offers
1. From application detail, click Send Offer
2. Enter position and salary
3. Offer letter generated and emailed
4. Track acceptance status

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists

### Email Not Sending
- Verify SMTP credentials
- Check spam folder
- Enable "Less secure app access" for Gmail

### File Upload Error
- Check uploads directory permissions
- Verify file size under 5MB
- Ensure correct file format (PDF, DOC)

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👥 Support

For issues or questions, please open an issue on GitHub.

## 🎉 Acknowledgments

Built with modern web technologies for efficient HR management and recruitment automation.
hr management
