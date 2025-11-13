# 📋 Deployment Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment
- [x] Code committed to GitHub
- [x] All tests passing (41/41)
- [x] All bugs fixed (5/5)
- [x] JWT Secret generated
- [x] Environment template created
- [ ] SMTP credentials ready (Gmail App Password)
- [ ] Choose deployment platform

---

## Render Deployment (Recommended)

### Database Setup (5 min)
- [ ] Sign up at https://render.com
- [ ] Create PostgreSQL database
- [ ] Name: `hrms-database`
- [ ] Copy Internal Database URL
- [ ] Database status: Running

### Backend API (5 min)
- [ ] Create Web Service
- [ ] Connect GitHub repo
- [ ] Configure build: `npm install`
- [ ] Configure start: `node server/index.js`
- [ ] Add all environment variables:
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL (from database)
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRES_IN=7d
  - [ ] SMTP_HOST
  - [ ] SMTP_PORT
  - [ ] SMTP_USER
  - [ ] SMTP_PASSWORD
  - [ ] COMPANY_NAME
  - [ ] COMPANY_EMAIL
- [ ] Deploy backend
- [ ] Backend status: Live
- [ ] Copy backend URL: ________________

### Run Migrations (1 min)
- [ ] Open Shell tab in backend service
- [ ] Run: `npm run migrate`
- [ ] Verify: "✅ Migrations completed successfully"

### Frontend Deployment (5 min)
- [ ] Create Static Site
- [ ] Connect same GitHub repo
- [ ] Root directory: `client`
- [ ] Build: `npm install && npm run build`
- [ ] Publish: `client/dist`
- [ ] Add environment variable:
  - [ ] VITE_API_URL (backend URL + /api)
- [ ] Deploy frontend
- [ ] Frontend status: Live
- [ ] Copy frontend URL: ________________

### Update Backend URLs (1 min)
- [ ] Go to backend service
- [ ] Add environment variables:
  - [ ] CLIENT_URL (frontend URL)
  - [ ] SERVER_URL (backend URL)
- [ ] Save and redeploy

### Create Admin User (1 min)
- [ ] Run curl command to create admin
- [ ] Verify: "User registered successfully"
- [ ] Admin email: ________________
- [ ] Admin password: ________________

---

## Post-Deployment

### Immediate Tasks (10 min)
- [ ] Open frontend URL
- [ ] Login with admin credentials
- [ ] Change admin password (in Settings)
- [ ] Update company settings
- [ ] Test email functionality:
  - [ ] Create test job
  - [ ] Submit test application
  - [ ] Check email received

### Configuration (15 min)
- [ ] Add company logo (optional)
- [ ] Customize email templates (optional)
- [ ] Create HR users
- [ ] Set up job categories
- [ ] Configure form templates

### Testing (20 min)
- [ ] Create real job posting
- [ ] Test public application form
- [ ] Test file upload (resume)
- [ ] Test application management
- [ ] Test interview scheduling
- [ ] Test offer creation
- [ ] Test all email notifications

### Optional Enhancements
- [ ] Add custom domain
- [ ] Configure SSL certificate
- [ ] Set up monitoring/alerts
- [ ] Enable database backups
- [ ] Add analytics tracking
- [ ] Configure CDN (for files)
- [ ] Set up error tracking (Sentry)

---

## URLs & Credentials

**GitHub Repository:**
https://github.com/bhanuthammali142/jaaynth-hrms

**JWT Secret:**
`mQnEwuyisRV/qK+jtidwRadikZu5Y3JlbBND+VusyFI=`

**Database URL:**
_________________________

**Backend URL:**
_________________________

**Frontend URL:**
_________________________

**Admin Credentials:**
- Email: _________________________
- Password: _________________________

**SMTP Settings:**
- Host: smtp.gmail.com
- Port: 587
- User: _________________________
- Password: _________________________

---

## Troubleshooting

### Database Won't Connect
- [ ] Check DATABASE_URL is correct
- [ ] Verify database is running
- [ ] Check network access settings

### Backend Won't Start
- [ ] Check build logs
- [ ] Verify all environment variables set
- [ ] Check Node.js version (16+)

### Frontend Shows 404
- [ ] Check build command ran successfully
- [ ] Verify publish directory is correct
- [ ] Check VITE_API_URL is set

### CORS Errors
- [ ] Verify CLIENT_URL in backend
- [ ] Check CORS settings in server/index.js
- [ ] Redeploy backend after URL change

### Emails Not Sending
- [ ] Verify SMTP credentials
- [ ] Use Gmail App Password (not regular password)
- [ ] Check spam folder
- [ ] Test SMTP connection

---

## Performance Monitoring

After 24 hours:
- [ ] Check response times
- [ ] Monitor database queries
- [ ] Review error logs
- [ ] Check email delivery rate
- [ ] Monitor disk usage

After 1 week:
- [ ] Review user feedback
- [ ] Optimize slow queries
- [ ] Check for errors
- [ ] Plan scaling if needed

---

## Backup Strategy

- [ ] Set up daily database backups
- [ ] Backup environment variables
- [ ] Document deployment process
- [ ] Save admin credentials securely

---

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS (auto on Render)
- [ ] Set secure cookie flags
- [ ] Regular dependency updates
- [ ] Monitor for vulnerabilities
- [ ] Set up rate limiting alerts

---

## Success Criteria

Your deployment is successful when:

✅ Frontend loads without errors
✅ Can login with admin account
✅ Can create jobs
✅ Can submit applications
✅ Emails are delivered
✅ Can schedule interviews
✅ Can create offers
✅ Dashboard shows statistics
✅ No console errors
✅ All features working

---

## Next Steps After Deployment

1. **Train HR Team**
   - Show them how to create jobs
   - Demonstrate application management
   - Explain interview scheduling
   - Walk through offer process

2. **Create Job Templates**
   - Set up common form fields
   - Create department categories
   - Prepare email templates

3. **Marketing**
   - Share job application URLs
   - Add to careers page
   - Promote on social media
   - Integrate with job boards

4. **Monitor & Iterate**
   - Collect feedback
   - Fix issues quickly
   - Add requested features
   - Optimize performance

---

## Support Resources

- **Documentation**: Check DEPLOY_NOW.md
- **Troubleshooting**: See TROUBLESHOOTING.md
- **API Reference**: Read API.md
- **User Guide**: Review USER_GUIDE.md

---

## Deployment Complete! 🎉

Once all items are checked:

✅ Your HRMS is live and running
✅ All features tested and working
✅ Users can access the application
✅ Ready for production use

**Congratulations on your successful deployment!** 🚀

---

*Deployment Date: _______________*
*Deployed By: _______________*
*Platform: _______________*
*Version: 1.0.0*
