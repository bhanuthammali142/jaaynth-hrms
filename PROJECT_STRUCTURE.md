# HRMS Project Structure

## Directory Overview

```
jaaynth-hrms/
├── server/                      # Backend API
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── upload.js            # File upload handling
│   │   ├── validate.js          # Input validation
│   │   └── errorHandler.js      # Global error handling
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job posting model
│   │   ├── Application.js       # Application model
│   │   ├── Interview.js         # Interview model
│   │   └── Offer.js             # Offer model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── jobs.js              # Job management routes
│   │   ├── applications.js      # Application routes
│   │   ├── interviews.js        # Interview routes
│   │   ├── offers.js            # Offer routes
│   │   └── dashboard.js         # Dashboard statistics
│   ├── services/
│   │   └── emailService.js      # Email notifications
│   ├── migrations/
│   │   ├── createTables.js      # Database schema
│   │   └── run.js               # Migration runner
│   └── index.js                 # Main server file
│
├── client/                      # Frontend React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Main layout
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── Header.jsx       # Top header
│   │   │   ├── PrivateRoute.jsx # Protected routes
│   │   │   └── FormBuilder.jsx  # Drag-drop form builder
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Dashboard.jsx    # Dashboard page
│   │   │   ├── Jobs.jsx         # Jobs listing
│   │   │   ├── JobForm.jsx      # Create/Edit job
│   │   │   ├── Applications.jsx # Applications list
│   │   │   ├── ApplicationDetail.jsx # Application details
│   │   │   ├── Interviews.jsx   # Interviews management
│   │   │   ├── Offers.jsx       # Offers management
│   │   │   ├── Settings.jsx     # Settings page
│   │   │   └── PublicJobApplication.jsx # Public form
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Auth state management
│   │   ├── utils/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS config
│   └── package.json             # Client dependencies
│
├── uploads/                     # Uploaded resumes (created at runtime)
├── logs/                        # Application logs (created at runtime)
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Docker image definition
├── docker-compose.yml           # Docker Compose config
├── ecosystem.config.js          # PM2 configuration
├── package.json                 # Root dependencies
├── setup.sh                     # Linux/Mac setup script
├── setup.bat                    # Windows setup script
├── README.md                    # Main documentation
├── DEPLOYMENT.md                # Deployment guide
├── QUICKSTART.md                # Quick start guide
└── LICENSE                      # License file
```

## Key Features by Module

### Authentication & Authorization
- **Files**: `server/routes/auth.js`, `server/middleware/auth.js`
- JWT-based authentication
- Role-based access control (Admin, HR)
- Password hashing with bcrypt
- Token expiration handling

### Job Management
- **Files**: `server/routes/jobs.js`, `server/models/Job.js`, `client/src/pages/Jobs.jsx`
- Create, read, update, delete jobs
- Drag-and-drop form builder
- Job status management (active/closed)
- Public shareable application links

### Application Processing
- **Files**: `server/routes/applications.js`, `server/models/Application.js`
- Public application submission
- Resume upload and storage
- Auto-scoring system
- Status workflow (new → shortlisted → interviewed → offered/rejected)

### Interview Scheduling
- **Files**: `server/routes/interviews.js`, `server/models/Interview.js`
- Schedule interviews with candidates
- Meeting link generation
- Email notifications
- Status tracking (scheduled/completed/cancelled)

### Offer Management
- **Files**: `server/routes/offers.js`, `server/models/Offer.js`
- Generate offer letters
- Salary management
- Track acceptance/rejection
- Email delivery

### Email Notifications
- **Files**: `server/services/emailService.js`
- Application received confirmation
- Interview invitation
- Offer letter delivery
- Rejection notifications

### Dashboard & Analytics
- **Files**: `server/routes/dashboard.js`, `client/src/pages/Dashboard.jsx`
- Real-time statistics
- Recent activity feed
- Application status breakdown
- Quick actions

## Database Schema

### Tables
1. **users** - System users (HR, Admin)
2. **jobs** - Job postings with form schemas
3. **applications** - Candidate applications
4. **interviews** - Scheduled interviews
5. **offers** - Job offers
6. **settings** - System configuration

### Relationships
- jobs → users (created_by)
- applications → jobs (job_id)
- interviews → applications (application_id)
- interviews → users (interviewer)
- offers → applications (application_id)

## Technology Stack

### Backend
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: Helmet, CORS, bcrypt

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **HTTP Client**: Axios
- **Form Builder**: React DnD
- **Icons**: Lucide React
- **Build Tool**: Vite

### DevOps
- **Containerization**: Docker
- **Process Manager**: PM2
- **Database Migrations**: Custom scripts
- **Environment**: dotenv

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Password hashing (bcrypt)
   - Secure token storage

2. **Authorization**
   - Role-based access control
   - Route protection middleware
   - API endpoint guards

3. **Input Validation**
   - Express-validator for all inputs
   - File type and size restrictions
   - SQL injection prevention

4. **Security Headers**
   - Helmet.js for HTTP headers
   - CORS configuration
   - Rate limiting

5. **File Upload Security**
   - Type validation (PDF, DOC only)
   - Size limits (5MB)
   - Secure file naming

## API Endpoints Summary

### Public Endpoints
- `POST /api/applications/apply/:jobId` - Submit application
- `GET /api/jobs/:id` - View job details
- `PATCH /api/offers/respond/:id` - Accept/reject offer

### Protected Endpoints (HR/Admin)
- Authentication: `/api/auth/*`
- Jobs: `/api/jobs/*`
- Applications: `/api/applications/*`
- Interviews: `/api/interviews/*`
- Offers: `/api/offers/*`
- Dashboard: `/api/dashboard/*`

## Environment Variables

### Required
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`

### Optional
- `PORT` (default: 5000)
- `NODE_ENV` (default: development)
- `CLIENT_URL` (for CORS)
- `AWS_*` (for S3 storage)
- `GOOGLE_*` (for Calendar API)

## Performance Considerations

1. **Database**
   - Indexed columns (email, status, job_id)
   - Connection pooling
   - Prepared statements

2. **API**
   - Pagination support
   - Rate limiting
   - Gzip compression

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Optimized builds (Vite)

4. **File Storage**
   - Local storage with S3 fallback
   - CDN ready
   - Efficient file serving

## Deployment Support

Compatible with:
- **Cloud Platforms**: Vercel, Render, Heroku, AWS, Digital Ocean
- **VPS**: Any Linux server with Node.js
- **Shared Hosting**: cPanel with Node.js support
- **Containers**: Docker, Kubernetes

## Testing Strategy

### Manual Testing Checklist
1. User registration and login
2. Job creation with form builder
3. Application submission
4. Status updates and workflows
5. Email delivery
6. File uploads
7. Interview scheduling
8. Offer generation

### Recommended Automated Testing
- Unit tests for models and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows

## Maintenance

### Regular Tasks
- Database backups
- Log rotation
- Security updates
- Performance monitoring
- Email deliverability checks

### Monitoring Points
- API response times
- Database query performance
- Email delivery rates
- Storage usage
- Error rates

## Extensibility

### Easy to Add
- New form field types
- Additional email templates
- Custom scoring algorithms
- Integration with calendar services
- Third-party ATS integration
- Advanced analytics
- Multi-tenancy support
- File storage providers

### Plugin Points
- Custom middleware
- Additional routes
- New models
- Custom email service
- Storage adapters

## Support & Resources

- **Documentation**: README.md, DEPLOYMENT.md, QUICKSTART.md
- **Code Comments**: Inline documentation
- **Environment Template**: .env.example
- **Setup Scripts**: setup.sh, setup.bat
- **Docker Support**: Dockerfile, docker-compose.yml
