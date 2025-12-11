# 📋 Quick Reference Card
**School Biometric Access System - Administrator Guide**

---

## 🚀 Quick Start

### First Time Setup
1. Install dependencies: `npm install`
2. Download models: `./setup.sh` (or manually)
3. Create Supabase project
4. Run `database-schema.sql` in Supabase SQL Editor
5. Copy `.env.example` to `.env`
6. Add Supabase credentials to `.env`
7. Run: `npm run dev`
8. Open: `http://localhost:3000`

---

## 👥 User Management

### Register New User
1. Click "Register New User"
2. Allow camera access
3. Position face in view
4. Click "Capture Face"
5. Fill in details
6. Click "Register User"

### Delete User
1. Go to Dashboard
2. Click "Registered Users" tab
3. Find user
4. Click "Delete"
5. Confirm deletion

---

## 🔍 Access Verification

### Single Verification
1. Click "Verify Access"
2. Allow camera access
3. Click "Verify Face"
4. Wait for result (1-2 seconds)

### Continuous Mode
1. Click "Verify Access"
2. Enable "Continuous Mode" toggle
3. System scans every 2 seconds
4. Results display automatically

---

## 📊 Monitoring

### View Statistics
- Dashboard shows:
  - Total users
  - Students count
  - Lecturers count
  - Staff count

### Check Access Logs
1. Go to Dashboard
2. Click "Access Logs" tab
3. View recent access attempts
4. Check confidence scores

---

## 🔧 Common Tasks

### Update Environment
```bash
# Edit credentials
nano .env

# Restart application
npm run dev
```

### Build for Production
```bash
npm run build
# Output in: dist/
```

### Deploy
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod

# Docker
docker build -t biometric .
docker run -p 3000:3000 biometric
```

---

## ⚙️ Configuration

### Adjust Recognition Sensitivity
File: `src/school-biometric-system.jsx`
Line: ~665

```javascript
const threshold = 0.6;
// Lower = stricter (0.4-0.5)
// Higher = lenient (0.7-0.8)
```

### Change Scan Interval
Line: ~549

```javascript
}, 2000); // milliseconds
// 1000 = 1 second
// 2000 = 2 seconds
```

---

## 🐛 Troubleshooting

### Camera Not Working
- ✅ Use HTTPS (required)
- ✅ Grant camera permissions
- ✅ Check browser compatibility
- ✅ Close other apps using camera

### Face Not Detected
- ✅ Improve lighting
- ✅ Face camera directly
- ✅ Remove obstructions
- ✅ Move closer to camera

### Models Not Loading
```bash
# Check models exist
ls public/models/

# Should see:
# - ssd_mobilenetv1_*
# - face_landmark_68_*
# - face_recognition_*
```

### Database Errors
- ✅ Verify Supabase credentials
- ✅ Check internet connection
- ✅ Ensure tables exist
- ✅ Check RLS policies

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
rm -rf .vite
npm run dev
```

---

## 🔒 Security Tasks

### Weekly
- [ ] Review access logs
- [ ] Check for anomalies
- [ ] Verify system health

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Security audit: `npm audit`
- [ ] Backup database
- [ ] Review user list

### Quarterly
- [ ] Rotate API keys
- [ ] Full security review
- [ ] Update documentation
- [ ] Staff training

---

## 📞 Emergency Procedures

### System Down
1. Check server status
2. Review error logs
3. Restart services
4. Contact IT support

### Unauthorized Access Attempt
1. Review access logs
2. Identify pattern
3. Block if necessary
4. Report to security

### Data Breach Suspected
1. Disconnect system immediately
2. Notify security team
3. Preserve evidence
4. Follow incident response plan

---

## 📊 Performance Tips

### For High Traffic
- Enable Continuous Mode
- Use dedicated hardware
- Optimize database queries
- Consider load balancing

### For Accuracy
- Good lighting during registration
- Multiple face angles
- Clear camera lens
- Regular re-enrollment

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/school-biometric-system.jsx` | Main application |
| `.env` | Configuration |
| `database-schema.sql` | Database setup |
| `README.md` | Full documentation |
| `DEPLOYMENT.md` | Deployment guide |
| `SECURITY.md` | Security guidelines |

---

## 🆘 Support Contacts

| Issue | Contact |
|-------|---------|
| Technical | admin@yourschool.edu |
| Security | security@yourschool.edu |
| Privacy | dpo@yourschool.edu |
| General | support@yourschool.edu |

---

## 🔗 Quick Links

- Supabase Dashboard: https://app.supabase.com
- GitHub Repository: [Your Repo]
- Deployment URL: [Your URL]
- Documentation: README.md

---

## 💡 Pro Tips

1. **Backup regularly** - Export user data monthly
2. **Monitor logs** - Check daily for anomalies
3. **Update promptly** - Install security updates ASAP
4. **Train users** - Educate on proper use
5. **Test often** - Verify system accuracy regularly
6. **Document changes** - Keep changelog updated
7. **Plan maintenance** - Schedule during low-traffic times
8. **Stay secure** - Follow SECURITY.md guidelines

---

## 📈 Success Metrics

Track these metrics:
- ✅ Average verification time (target: <2 seconds)
- ✅ Recognition accuracy (target: >95%)
- ✅ False rejection rate (target: <5%)
- ✅ System uptime (target: >99%)
- ✅ User satisfaction (survey regularly)

---

## 🎯 Best Practices

1. **Registration**
   - Well-lit environment
   - Clear face visibility
   - Multiple captures if needed
   - Verify details carefully

2. **Verification**
   - Consistent positioning
   - Clean camera lens
   - Monitor confidence scores
   - Re-enroll if accuracy drops

3. **Maintenance**
   - Regular backups
   - Security updates
   - Performance monitoring
   - User feedback review

4. **Security**
   - Strong passwords
   - Limited admin access
   - Regular audits
   - Incident response plan

---

**Print this card and keep it handy for quick reference!**

Version 1.0 | Last Updated: December 2024
