# 🚀 Getting Started Guide
**School Biometric Access System - Complete Setup Walkthrough**

This guide will walk you through the complete setup process from scratch. Follow each step carefully.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Supabase Setup](#supabase-setup)
3. [Project Setup](#project-setup)
4. [Configuration](#configuration)
5. [First Run](#first-run)
6. [Testing](#testing)
7. [Next Steps](#next-steps)

---

## 1️⃣ Prerequisites

### Install Node.js

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer
3. Verify: Open Command Prompt and run:
   ```bash
   node --version
   npm --version
   ```

**Mac:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Install Git (Optional but recommended)

**Windows:** Download from [git-scm.com](https://git-scm.com/)

**Mac:**
```bash
brew install git
```

**Linux:**
```bash
sudo apt-get install git
```

---

## 2️⃣ Supabase Setup

### Step 1: Create Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign up with GitHub, Google, or email
4. Verify your email if required

### Step 2: Create New Project

1. Click **"New project"**
2. Fill in details:
   - **Name:** `school-biometric-system`
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose closest to your location
   - **Pricing Plan:** Free (sufficient for testing)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project initialization

### Step 3: Get API Credentials

1. In your project dashboard, click **Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
4. **IMPORTANT:** Copy both - you'll need them soon!

### Step 4: Setup Database

1. Click **SQL Editor** in the left sidebar
2. Click **"New query"**
3. Open the `database-schema.sql` file from this project
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see: "Success. No rows returned"

### Step 5: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see two tables:
   - ✅ `users`
   - ✅ `access_logs`
3. If you see these, database setup is complete! 🎉

---

## 3️⃣ Project Setup

### Step 1: Extract Project Files

1. Extract the `school-biometric-system` folder
2. Open Terminal/Command Prompt
3. Navigate to the project:
   ```bash
   cd path/to/school-biometric-system
   ```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- Supabase client
- face-api.js
- Vite (build tool)
- Other development tools

**Wait time:** 1-3 minutes depending on internet speed

### Step 3: Download Face Recognition Models

**Option A: Automated (Recommended)**

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

The script will:
- ✅ Create directories
- ✅ Download models
- ✅ Create .env file

**Option B: Manual Download**

```bash
# Create models directory
mkdir -p public/models
cd public/models

# Download models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1

wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2

cd ../..
```

**Verify models downloaded:**
```bash
ls -lh public/models/
```

You should see 7 files, total ~7MB

---

## 4️⃣ Configuration

### Step 1: Create Environment File

```bash
# Copy example file
cp .env.example .env
```

### Step 2: Add Supabase Credentials

Open `.env` file in a text editor:

```env
# Replace with YOUR credentials from Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-key-here
```

**Important:** 
- Replace `xxxxx` with your actual project URL
- Replace the key with your actual anon key
- Keep the `VITE_` prefix!

### Step 3: Update Main Application (Optional)

If you prefer hardcoding (not recommended for production):

Open `src/school-biometric-system.jsx`

Find lines 8-11:
```javascript
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

Replace with your credentials:
```javascript
const supabase = createClient(
  'https://xxxxx.supabase.co',
  'eyJhbGc...your-key-here'
);
```

---

## 5️⃣ First Run

### Start Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 324 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Open in Browser

1. Open your browser
2. Go to: `http://localhost:3000`
3. You should see the **SecureEntry** homepage! 🎉

### Grant Camera Permissions

When you try to register or verify:
1. Browser will ask for camera permission
2. Click **"Allow"**
3. Camera feed should appear

**Troubleshooting:**
- If camera doesn't work on HTTP, you may need HTTPS
- Try `https://localhost:3000` (may show security warning)
- Or use Vercel/Netlify for automatic HTTPS

---

## 6️⃣ Testing

### Test 1: Register Your First User

1. Click **"Register New User"**
2. Wait for camera to start
3. Position your face in the camera
4. Click **"Capture Face"**
5. Fill in details:
   - Name: "Test User"
   - ID: "TEST001"
   - Role: "Student"
   - Email: "test@example.com"
6. Click **"Register User"**
7. You should see: ✅ "Registration successful!"

### Test 2: Verify Access

1. Click **"Verify Access"**
2. Position your face in camera
3. Click **"Verify Face"**
4. You should see: ✅ Green overlay with your name

### Test 3: Check Dashboard

1. Click **"Dashboard"**
2. You should see:
   - Total Users: 1
   - Students: 1
   - Your registered user in the table
   - Access log showing registration

### Test 4: Delete User (Optional)

1. In Dashboard → Registered Users
2. Find "Test User"
3. Click **"Delete"**
4. Confirm deletion
5. User should be removed

---

## 7️⃣ Next Steps

### Customize the System

1. **Adjust Recognition Threshold**
   - Edit `src/school-biometric-system.jsx`
   - Line ~665: `const threshold = 0.6;`
   - Lower = stricter, Higher = lenient

2. **Change Branding**
   - Edit logo in header
   - Customize colors in CSS variables
   - Update page title in `index.html`

3. **Add More Features**
   - Email notifications
   - Multi-language support
   - Custom reports
   - Role-based permissions

### Deploy to Production

Choose a deployment platform:

**Option 1: Vercel (Easiest)**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Option 2: Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

### Secure Your System

1. **Update RLS Policies** (Important for production!)
   - See [SECURITY.md](SECURITY.md)
   - Implement proper authentication
   - Restrict admin access

2. **Enable HTTPS**
   - Required for camera access
   - Automatic with Vercel/Netlify
   - Manual setup for self-hosting

3. **Add Privacy Policy**
   - Inform users about data collection
   - Obtain consent
   - Comply with GDPR/local laws

### Monitor & Maintain

1. **Regular Checks**
   - Review access logs weekly
   - Update dependencies monthly
   - Security audit quarterly

2. **Backups**
   - Export user data regularly
   - Backup database
   - Keep code in Git

3. **Performance**
   - Monitor response times
   - Check recognition accuracy
   - Optimize if needed

---

## 🆘 Common Issues

### Issue: "Cannot find module"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Camera not working

**Solutions:**
- ✅ Use HTTPS (required in production)
- ✅ Grant camera permissions
- ✅ Close other apps using camera
- ✅ Try different browser (Chrome recommended)

### Issue: Models not loading

**Solution:**
```bash
# Verify models exist
ls -la public/models/

# Re-download if missing
cd public/models
# Run download commands again
```

### Issue: Database connection error

**Solutions:**
- ✅ Check Supabase credentials in .env
- ✅ Verify project is active in Supabase
- ✅ Check internet connection
- ✅ Ensure tables are created

### Issue: Face not recognized

**Solutions:**
- ✅ Ensure good lighting
- ✅ Face camera directly
- ✅ Re-register with better conditions
- ✅ Adjust threshold in code

---

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Complete documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guides
- [SECURITY.md](SECURITY.md) - Security best practices
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick admin guide

### External Resources
- [Supabase Docs](https://supabase.com/docs)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

### Support
- Check documentation first
- Review troubleshooting sections
- Open GitHub issue if needed
- Contact school IT support

---

## ✅ Setup Checklist

Before going live, ensure:

- [ ] Node.js installed (v16+)
- [ ] Supabase project created
- [ ] Database tables created
- [ ] API credentials configured
- [ ] Dependencies installed
- [ ] Face models downloaded
- [ ] Application runs locally
- [ ] Camera access working
- [ ] Face registration tested
- [ ] Face verification tested
- [ ] Dashboard accessible
- [ ] Ready to deploy!

---

## 🎉 Congratulations!

You've successfully set up the School Biometric Access System!

**What you've accomplished:**
- ✅ Installed all dependencies
- ✅ Configured Supabase database
- ✅ Downloaded AI models
- ✅ Tested face recognition
- ✅ Ready for deployment

**Next actions:**
1. Register actual users
2. Test in real conditions
3. Deploy to production
4. Train administrators
5. Go live! 🚀

---

**Need help?** Check the documentation or contact support.

**Good luck with your biometric access system!** 🔐
