# HRMS Application Flow & User Guide

## 🎯 Application Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HR/ADMIN USER JOURNEY                         │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN
   ↓
2. DASHBOARD (View Statistics & Activity)
   ↓
3. CREATE JOB POSTING
   │
   ├─ Add Job Details (Title, Department, Description)
   ├─ Build Custom Application Form (Drag & Drop)
   ├─ Publish Job
   └─ Share Application Link
   ↓
4. MANAGE APPLICATIONS
   │
   ├─ Review Submissions
   ├─ View Resumes
   ├─ Check Scores
   └─ Update Status:
      │
      ├─ Shortlist → Send Email
      ├─ Reject → Send Email
      └─ Move to Interview
   ↓
5. SCHEDULE INTERVIEWS
   │
   ├─ Set Date & Time
   ├─ Add Meeting Link
   ├─ Send Invite Email
   └─ Track Status
   ↓
6. SEND OFFERS
   │
   ├─ Enter Position & Salary
   ├─ Generate Offer Letter
   ├─ Email to Candidate
   └─ Track Response
   ↓
7. ONBOARDING (Future Feature)

┌─────────────────────────────────────────────────────────────────┐
│                    CANDIDATE USER JOURNEY                        │
└─────────────────────────────────────────────────────────────────┘

1. RECEIVE APPLICATION LINK
   ↓
2. VIEW JOB DETAILS
   ↓
3. FILL APPLICATION FORM
   │
   ├─ Personal Information
   ├─ Upload Resume
   └─ Answer Custom Questions
   ↓
4. SUBMIT APPLICATION
   ↓
5. RECEIVE CONFIRMATION EMAIL
   ↓
6. GET INTERVIEW INVITATION (if shortlisted)
   ↓
7. ATTEND INTERVIEW
   ↓
8. RECEIVE OFFER (if selected)
   ↓
9. ACCEPT/REJECT OFFER
```

## 📊 System Architecture

```
┌──────────────┐
│   Browser    │
│  (Client)    │
└──────┬───────┘
       │
       │ HTTP/HTTPS
       │
┌──────▼────────────────────────────────────────┐
│         React Frontend (Vite)                  │
│  ┌──────────────────────────────────────┐    │
│  │  Components:                          │    │
│  │  - Dashboard                          │    │
│  │  - Job Management                     │    │
│  │  - Application Tracking               │    │
│  │  - Interview Scheduler                │    │
│  │  - Offer Management                   │    │
│  └──────────────────────────────────────┘    │
└────────────────┬──────────────────────────────┘
                 │
                 │ REST API (Axios)
                 │
┌────────────────▼──────────────────────────────┐
│         Express Backend API                    │
│  ┌──────────────────────────────────────┐    │
│  │  Routes:                              │    │
│  │  - Authentication                     │    │
│  │  - Jobs                               │    │
│  │  - Applications                       │    │
│  │  - Interviews                         │    │
│  │  - Offers                             │    │
│  │  - Dashboard                          │    │
│  └──────────────────────────────────────┘    │
│                                                │
│  ┌──────────────────────────────────────┐    │
│  │  Services:                            │    │
│  │  - Email Notifications                │    │
│  │  - File Upload                        │    │
│  │  - Authentication (JWT)               │    │
│  └──────────────────────────────────────┘    │
└────────────────┬──────────────────────────────┘
                 │
                 ├─────────────────┬─────────────────┐
                 │                 │                 │
         ┌───────▼────────┐  ┌────▼─────┐  ┌───────▼────────┐
         │   PostgreSQL   │  │  SMTP    │  │  File System   │
         │   Database     │  │  Server  │  │   (Uploads)    │
         └────────────────┘  └──────────┘  └────────────────┘
```

## 🔐 Authentication Flow

```
1. User enters credentials
   ↓
2. Backend validates credentials
   ↓
3. Password checked with bcrypt
   ↓
4. JWT token generated
   ↓
5. Token sent to client
   ↓
6. Client stores token (localStorage)
   ↓
7. Token included in all API requests
   ↓
8. Backend validates token on each request
   ↓
9. Access granted/denied based on role
```

## 📧 Email Notification Flow

```
APPLICATION RECEIVED
  ↓
  Send acknowledgment to candidate
  
SHORTLISTED
  ↓
  Notify candidate about next steps
  
INTERVIEW SCHEDULED
  ↓
  Send meeting details and link
  
OFFER SENT
  ↓
  Email offer letter with accept/reject links
  
REJECTED
  ↓
  Send polite rejection email
```

## 🏗️ Database Relationships

```
         ┌─────────┐
         │  Users  │
         └────┬────┘
              │
              │ created_by
              ↓
         ┌─────────┐
         │  Jobs   │
         └────┬────┘
              │
              │ job_id
              ↓
      ┌───────────────┐
      │ Applications  │
      └───────┬───────┘
              │
       ┌──────┴──────┐
       │             │
       │ application_id
       ↓             ↓
  ┌──────────┐  ┌────────┐
  │Interviews│  │ Offers │
  └──────────┘  └────────┘
```

## 🎨 UI/UX Flow

### HR Dashboard Layout
```
┌─────────────────────────────────────────────────────┐
│  [LOGO] HRMS                        [User] [Logout] │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │           Main Content Area             │
│          │                                           │
│ ☐ Dash   │  ┌───────────────────────────────────┐  │
│ ☐ Jobs   │  │                                   │  │
│ ☐ Apps   │  │        Statistics Cards           │  │
│ ☐ Inter  │  │                                   │  │
│ ☐ Offers │  └───────────────────────────────────┘  │
│ ☐ Sets   │                                          │
│          │  ┌───────────────────────────────────┐  │
│          │  │                                   │  │
│          │  │      Recent Activity              │  │
│          │  │                                   │  │
│          │  └───────────────────────────────────┘  │
└──────────┴──────────────────────────────────────────┘
```

### Public Application Form
```
┌─────────────────────────────────────────────────────┐
│                   [Company Logo]                     │
│                                                      │
│            Apply for: Software Engineer              │
│                   Engineering Dept.                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Job Description:                                    │
│  [Full job description text here...]                │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Application Form                                    │
│                                                      │
│  Full Name: [_____________________]                 │
│  Email:     [_____________________]                 │
│  Resume:    [Choose File]                          │
│                                                      │
│  [Custom form fields based on job...]               │
│                                                      │
│              [Submit Application]                    │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## 📱 Responsive Design

The application is fully responsive:

- **Desktop (1024px+)**: Full sidebar navigation
- **Tablet (768px-1023px)**: Collapsible sidebar
- **Mobile (<768px)**: Bottom navigation bar

## ⚡ Performance Optimizations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading of components
   - Optimized bundle size (Vite)
   - Cached API responses

2. **Backend**
   - Database query optimization
   - Indexed columns
   - Connection pooling
   - Rate limiting

3. **Assets**
   - Compressed images
   - Minified CSS/JS
   - CDN-ready static files

## 🔒 Security Layers

```
Layer 1: Frontend Validation
  ↓
Layer 2: Network Security (HTTPS, CORS)
  ↓
Layer 3: API Rate Limiting
  ↓
Layer 4: JWT Authentication
  ↓
Layer 5: Input Validation (express-validator)
  ↓
Layer 6: SQL Injection Prevention (Parameterized Queries)
  ↓
Layer 7: File Upload Validation
  ↓
Layer 8: Role-Based Access Control
```

## 📈 Scalability Considerations

### Horizontal Scaling
```
Load Balancer
    │
    ├─── App Instance 1
    ├─── App Instance 2
    └─── App Instance 3
         │
         └─── Shared Database
         └─── Shared File Storage (S3)
```

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Add caching layer (Redis)

## 🛠️ Customization Points

### Easy Customizations
1. **Branding**
   - Update logo
   - Change color scheme (tailwind.config.js)
   - Modify company name

2. **Email Templates**
   - Edit emailService.js
   - Add new notification types

3. **Form Fields**
   - Add new field types in FormBuilder
   - Extend validation rules

4. **Scoring Algorithm**
   - Modify calculateApplicationScore()
   - Add weighted criteria

5. **Workflows**
   - Add new application statuses
   - Customize status transitions

## 🎓 Best Practices

### For HR Users
1. Create detailed job descriptions
2. Use relevant custom form fields
3. Review applications promptly
4. Schedule interviews with adequate notice
5. Send timely rejection emails

### For Developers
1. Always validate input
2. Handle errors gracefully
3. Log important events
4. Keep dependencies updated
5. Follow coding standards

## 📞 Support Workflow

```
Issue Reported
    ↓
Check Application Logs
    ↓
Review Database State
    ↓
Test Email Delivery
    ↓
Verify Configuration
    ↓
Apply Fix
    ↓
Test in Staging
    ↓
Deploy to Production
```

## 🚀 Future Enhancements

Potential additions:
- Advanced analytics dashboard
- AI-powered resume screening
- Video interview integration
- Background check integration
- Onboarding workflow
- Employee portal
- Mobile app
- Multi-language support
- Custom report generation
- Slack/Teams integration
