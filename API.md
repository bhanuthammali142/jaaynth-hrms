# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin" | "hr"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## Jobs

### List All Jobs
```http
GET /jobs?status=active&department=Engineering
```

**Query Parameters:**
- `status` (optional): "active" | "closed"
- `department` (optional): Filter by department

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Software Engineer",
    "department": "Engineering",
    "description": "We are looking for...",
    "form_schema": [...],
    "status": "active",
    "created_by": "uuid",
    "created_by_name": "John Doe",
    "applications_count": 5,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Job Details
```http
GET /jobs/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Software Engineer",
  "department": "Engineering",
  "description": "We are looking for...",
  "form_schema": [
    {
      "id": "1",
      "type": "text",
      "label": "LinkedIn Profile",
      "required": true,
      "placeholder": "https://linkedin.com/in/..."
    }
  ],
  "status": "active",
  "created_by": "uuid",
  "created_by_name": "John Doe",
  "created_by_email": "john@example.com",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Create Job (Protected)
```http
POST /jobs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "department": "Engineering",
  "description": "We are looking for...",
  "formSchema": [
    {
      "id": "1",
      "type": "text",
      "label": "LinkedIn Profile",
      "required": true,
      "placeholder": "https://linkedin.com/in/..."
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Software Engineer",
  "department": "Engineering",
  "description": "We are looking for...",
  "form_schema": [...],
  "status": "active",
  "created_by": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Job (Protected)
```http
PUT /jobs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "department": "Engineering",
  "description": "Updated description",
  "formSchema": [...],
  "status": "active"
}
```

### Update Job Status (Protected)
```http
PATCH /jobs/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "closed"
}
```

### Delete Job (Admin Only)
```http
DELETE /jobs/:id
Authorization: Bearer <token>
```

### Get Job Statistics (Protected)
```http
GET /jobs/stats/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "active_jobs": 5,
  "closed_jobs": 2,
  "total_jobs": 7
}
```

---

## Applications

### Submit Application (Public)
```http
POST /applications/apply/:jobId
Content-Type: multipart/form-data

candidateName: John Doe
candidateEmail: john@example.com
answers: {"LinkedIn Profile": "https://linkedin.com/in/johndoe"}
resume: [file]
```

**Response:**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": "uuid",
    "job_id": "uuid",
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "resume_url": "http://localhost:5000/uploads/resume-123.pdf",
    "answers": {...},
    "score": 75,
    "status": "new",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### List Applications (Protected)
```http
GET /applications?jobId=uuid&status=new&search=john&limit=20&offset=0
Authorization: Bearer <token>
```

**Query Parameters:**
- `jobId` (optional): Filter by job
- `status` (optional): "new" | "shortlisted" | "interviewed" | "offered" | "rejected"
- `search` (optional): Search by name or email
- `minScore` (optional): Minimum score filter
- `limit` (optional): Pagination limit
- `offset` (optional): Pagination offset

**Response:**
```json
[
  {
    "id": "uuid",
    "job_id": "uuid",
    "job_title": "Software Engineer",
    "job_department": "Engineering",
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "resume_url": "http://localhost:5000/uploads/resume-123.pdf",
    "answers": {...},
    "score": 75,
    "status": "new",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Application Details (Protected)
```http
GET /applications/:id
Authorization: Bearer <token>
```

### Update Application Status (Protected)
```http
PATCH /applications/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "shortlisted"
}
```

### Delete Application (Admin Only)
```http
DELETE /applications/:id
Authorization: Bearer <token>
```

### Get Application Statistics (Protected)
```http
GET /applications/stats/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_applications": 100,
  "new_applications": 20,
  "shortlisted": 30,
  "interviewed": 25,
  "offered": 15,
  "rejected": 10
}
```

---

## Interviews

### List Interviews (Protected)
```http
GET /interviews?status=scheduled&interviewer=uuid&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): "scheduled" | "completed" | "cancelled"
- `interviewer` (optional): Filter by interviewer ID
- `startDate` (optional): Start date filter
- `endDate` (optional): End date filter

**Response:**
```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "job_title": "Software Engineer",
    "interviewer": "uuid",
    "interviewer_name": "Jane Smith",
    "scheduled_time": "2024-01-15T14:00:00.000Z",
    "meeting_link": "https://meet.google.com/abc-defg-hij",
    "notes": "Technical round",
    "status": "scheduled",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Interview Details (Protected)
```http
GET /interviews/:id
Authorization: Bearer <token>
```

### Schedule Interview (Protected)
```http
POST /interviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "uuid",
  "scheduledTime": "2024-01-15T14:00:00.000Z",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "notes": "Technical round"
}
```

**Response:**
```json
{
  "id": "uuid",
  "application_id": "uuid",
  "interviewer": "uuid",
  "scheduled_time": "2024-01-15T14:00:00.000Z",
  "meeting_link": "https://meet.google.com/abc-defg-hij",
  "notes": "Technical round",
  "status": "scheduled",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Interview (Protected)
```http
PUT /interviews/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "scheduledTime": "2024-01-15T15:00:00.000Z",
  "meetingLink": "https://meet.google.com/xyz-abcd-efg",
  "notes": "Updated notes",
  "status": "completed"
}
```

### Update Interview Status (Protected)
```http
PATCH /interviews/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Interview (Admin Only)
```http
DELETE /interviews/:id
Authorization: Bearer <token>
```

### Get Interview Statistics (Protected)
```http
GET /interviews/stats/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_interviews": 50,
  "scheduled": 20,
  "completed": 25,
  "cancelled": 5
}
```

---

## Offers

### List Offers (Protected)
```http
GET /offers?status=sent
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): "sent" | "accepted" | "rejected"

**Response:**
```json
[
  {
    "id": "uuid",
    "application_id": "uuid",
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "job_title": "Software Engineer",
    "position": "Senior Software Engineer",
    "salary": 120000,
    "offer_letter_url": "http://localhost:5000/api/offers/letter/uuid",
    "status": "sent",
    "sent_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Offer Details (Protected)
```http
GET /offers/:id
Authorization: Bearer <token>
```

### Create Offer (Protected)
```http
POST /offers
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationId": "uuid",
  "position": "Senior Software Engineer",
  "salary": 120000
}
```

**Response:**
```json
{
  "id": "uuid",
  "application_id": "uuid",
  "position": "Senior Software Engineer",
  "salary": 120000,
  "offer_letter_url": "http://localhost:5000/api/offers/letter/uuid",
  "status": "sent",
  "sent_at": "2024-01-01T00:00:00.000Z"
}
```

### Update Offer (Protected)
```http
PUT /offers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "position": "Lead Software Engineer",
  "salary": 150000
}
```

### Accept/Reject Offer (Public)
```http
PATCH /offers/respond/:id
Content-Type: application/json

{
  "status": "accepted"
}
```

### Update Offer Status (Protected)
```http
PATCH /offers/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted"
}
```

### Delete Offer (Admin Only)
```http
DELETE /offers/:id
Authorization: Bearer <token>
```

### Get Offer Letter (Public)
```http
GET /offers/letter/:applicationId
```

Returns HTML offer letter.

### Get Offer Statistics (Protected)
```http
GET /offers/stats/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_offers": 30,
  "sent": 10,
  "accepted": 15,
  "rejected": 5
}
```

---

## Dashboard

### Get Dashboard Overview (Protected)
```http
GET /dashboard/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "jobs": {
    "active_jobs": 5,
    "closed_jobs": 2,
    "total_jobs": 7
  },
  "applications": {
    "total_applications": 100,
    "new_applications": 20,
    "shortlisted": 30,
    "interviewed": 25,
    "offered": 15,
    "rejected": 10
  },
  "interviews": {
    "total_interviews": 50,
    "scheduled": 20,
    "completed": 25,
    "cancelled": 5
  },
  "offers": {
    "total_offers": 30,
    "sent": 10,
    "accepted": 15,
    "rejected": 5
  }
}
```

### Get Recent Activity (Protected)
```http
GET /dashboard/recent-activity
Authorization: Bearer <token>
```

**Response:**
```json
{
  "recentApplications": [
    {
      "id": "uuid",
      "candidate_name": "John Doe",
      "job_title": "Software Engineer",
      "status": "new",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "upcomingInterviews": [
    {
      "id": "uuid",
      "candidate_name": "Jane Smith",
      "job_title": "Product Manager",
      "scheduled_time": "2024-01-15T14:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Valid email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Resource already exists"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All `/api/*` endpoints
- **Headers**: 
  - `X-RateLimit-Limit`: Total allowed requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## File Upload

### Resume Upload Specifications
- **Max Size**: 5 MB
- **Allowed Types**: PDF, DOC, DOCX
- **Field Name**: `resume`
- **Endpoint**: `/api/applications/apply/:jobId`

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are version 4
- Pagination defaults: limit=20, offset=0
- JWT tokens expire after 7 days (configurable)
- CORS is enabled for configured CLIENT_URL
