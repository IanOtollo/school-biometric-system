# 🔐 School Biometric Access Control System

A modern, fast, and secure facial recognition-based biometric access control system for schools. Built with React, face-api.js, and Supabase.

![System Demo](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.39-green)

## ✨ Features

- **🎯 Fast Recognition**: ~1 second face verification with high accuracy
- **📸 Real-time Camera Access**: Live video feed for face capture and verification
- **👥 Multi-Role Support**: Separate tracking for students, lecturers, and support staff
- **🔒 Secure Database**: Encrypted face descriptors stored in Supabase
- **📊 Dashboard**: Real-time analytics and access logs
- **⚡ Continuous Mode**: Automatic scanning for high-traffic areas
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Beautiful, futuristic interface with smooth animations

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   React UI      │────▶│   face-api.js    │────▶│   Supabase      │
│   (Frontend)    │     │   (Face AI)      │     │   (Database)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (free tier works)
- A modern web browser with camera access
- HTTPS (required for camera access in production)

## 🚀 Quick Start

### 1. Clone the Project

```bash
# Create project directory
mkdir school-biometric-system
cd school-biometric-system

# Copy all project files here
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Download Face-API Models

Download the required face recognition models and place them in the `public/models` directory:

```bash
# Create models directory
mkdir -p public/models

# Download models from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
# You need these three models:
# - ssd_mobilenetv1_model-weights_manifest.json + shards
# - face_landmark_68_model-weights_manifest.json + shards
# - face_recognition_model-weights_manifest.json + shards
```

**Quick download script:**

```bash
cd public
mkdir models
cd models

# Download SSD MobileNet
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/ssd_mobilenetv1_model-shard1

# Download Face Landmarks
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Download Face Recognition
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_recognition_model-shard2
```

### 4. Setup Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Name: `school-biometric-system`
   - Database Password: (create a strong password)
   - Region: (choose closest to your location)
5. Wait for project to be created (~2 minutes)

#### Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

#### Setup Database Tables

1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire contents of `database-schema.sql`
3. Click "Run" to execute the SQL
4. Verify tables are created in Table Editor

### 5. Configure Environment

Open `src/school-biometric-system.jsx` and update lines 8-11:

```javascript
const supabase = createClient(
  'YOUR_SUPABASE_URL',        // Replace with your Supabase URL
  'YOUR_SUPABASE_ANON_KEY'    // Replace with your Anon Key
);
```

**Better approach (recommended):** Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then update the code to:

```javascript
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Important:** You may need to use HTTPS even in development. If camera doesn't work:

```bash
# Install mkcert for local HTTPS
npm install -g mkcert
mkcert create-ca
mkcert create-cert

# Update vite.config.js to use HTTPS
```

## 📖 Usage Guide

### Registering New Users

1. Click "Register New User" on home page
2. Allow camera access when prompted
3. Position face in camera view
4. Click "Capture Face" when face is detected
5. Fill in user details:
   - Full Name
   - ID Number (must be unique)
   - Role (Student/Lecturer/Staff)
   - Email (optional)
6. Click "Register User"
7. Wait for confirmation

### Verifying Access

1. Click "Verify Access" on home page
2. Allow camera access
3. Position face in camera view
4. Click "Verify Face" or enable "Continuous Mode"
5. System will:
   - ✅ Show green overlay with name if recognized
   - ❌ Show red overlay if not recognized
6. Access is logged automatically

### Dashboard

1. Click "Dashboard" in navigation
2. View statistics:
   - Total registered users
   - Breakdown by role
3. Switch between tabs:
   - **Users**: View/manage all registered users
   - **Logs**: View access history
4. Delete users if needed

## 🔧 Configuration

### Adjust Recognition Threshold

In `src/school-biometric-system.jsx`, line 665:

```javascript
const threshold = 0.6; // Lower = stricter, Higher = more lenient
```

Recommended values:
- `0.4-0.5`: Very strict (may reject legitimate users)
- `0.6`: Balanced (recommended)
- `0.7-0.8`: Lenient (may accept similar faces)

### Continuous Mode Settings

Adjust scan interval on line 549:

```javascript
interval = setInterval(() => {
  verifyFace();
}, 2000); // Change to adjust scan frequency (milliseconds)
```

## 🌐 Deployment

### Option 1: Vercel (Recommended)

Vercel offers free hosting with automatic HTTPS.

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

**Setup:**
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy automatically on push

**Vercel Configuration** (`vercel.json`):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Netlify Configuration** (`netlify.toml`):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your-repo-name/', // Add this
  // ... rest of config
});
```

### Option 4: Docker (Self-Hosted)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:

```bash
docker build -t biometric-system .
docker run -p 3000:3000 biometric-system
```

### Option 5: Traditional VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone your-repo
cd your-repo
npm install
npm run build

# Serve with nginx
sudo cp -r dist/* /var/www/html/

# Configure nginx for HTTPS (required for camera)
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Security Best Practices

### Database Security

1. **Enable RLS Properly**: Update policies in Supabase:

```sql
-- Restrict access to authenticated users only
ALTER POLICY "Enable read access for all users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');
```

2. **Use Service Role Key**: For server-side operations, use service role key instead of anon key

3. **Enable 2FA**: Enable two-factor authentication on Supabase account

### Application Security

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Input Validation**: Validate all user inputs
3. **HTTPS Only**: Always use HTTPS in production
4. **Regular Updates**: Keep dependencies updated

```bash
npm audit
npm audit fix
```

### Privacy Considerations

1. **Data Retention**: Implement log cleanup (see `cleanup_old_logs()` function)
2. **User Consent**: Ensure users consent to facial recognition
3. **Data Protection**: Comply with GDPR/local privacy laws
4. **Access Control**: Limit who can view dashboard

## 📊 Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | VARCHAR | User's full name |
| id_number | VARCHAR | Unique identifier |
| role | VARCHAR | student/lecturer/staff |
| email | VARCHAR | Contact email |
| face_descriptor | FLOAT8[] | 128D face vector |
| registered_at | TIMESTAMP | Registration time |
| updated_at | TIMESTAMP | Last update time |

### Access Logs Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | VARCHAR | User identifier |
| name | VARCHAR | User name |
| role | VARCHAR | User role |
| action | VARCHAR | granted/denied/registered |
| confidence | FLOAT8 | Match confidence % |
| timestamp | TIMESTAMP | Access time |

## 🐛 Troubleshooting

### Camera Not Working

**Issue**: Camera access denied or not showing

**Solutions**:
- Ensure HTTPS is enabled (HTTP only works on localhost)
- Check browser permissions
- Try different browser (Chrome/Edge recommended)
- Check if camera is being used by another app

### Face Not Detected

**Issue**: "No face detected" error

**Solutions**:
- Ensure good lighting
- Face camera directly
- Remove glasses/masks if possible
- Move closer to camera
- Check if models are loaded correctly

### Models Not Loading

**Issue**: "Error loading models"

**Solutions**:
```bash
# Verify models exist
ls -la public/models/

# Re-download if missing
cd public/models
# Run download script again
```

### Supabase Connection Errors

**Issue**: "Connection failed" or "Invalid API key"

**Solutions**:
- Verify credentials in code
- Check Supabase project is active
- Ensure RLS policies are configured
- Check network connectivity

### Recognition Not Accurate

**Issue**: Wrong person recognized or legitimate users rejected

**Solutions**:
- Adjust threshold value (line 665)
- Ensure good lighting during registration
- Re-register users with multiple angles
- Check camera quality

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

## 📈 Performance Optimization

### For High Traffic

1. **Enable Continuous Mode**: Auto-scan for busy entrances
2. **Optimize Database**: Add indexes (already included in schema)
3. **Cache Users**: Load all users on startup
4. **Use CDN**: Serve static files from CDN

### For Low-End Devices

```javascript
// Reduce video quality in camera config
const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: { 
    width: 320,  // Reduce from 640
    height: 240, // Reduce from 480
    facingMode: 'user' 
  }
});
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] Face capture successful
- [ ] Face verification accurate
- [ ] Dashboard loads correctly
- [ ] Access logs recorded
- [ ] User deletion works
- [ ] Mobile responsive
- [ ] Camera on different browsers
- [ ] HTTPS certificate valid

### Test Data

Use `database-schema.sql` sample data section for testing.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - feel free to use for your school or organization.

## 🆘 Support

For issues:
1. Check troubleshooting section
2. Review Supabase logs
3. Check browser console
4. Open GitHub issue with details

## 🎓 Credits

- **face-api.js**: Amazing face recognition library
- **Supabase**: Backend database platform
- **React**: UI framework
- **Vite**: Build tool

## 📝 Changelog

### Version 1.0.0
- Initial release
- Face registration and verification
- Multi-role support
- Dashboard with analytics
- Access logging
- Continuous scanning mode

---

**Made with ❤️ for Schools**

Need customization or enterprise support? Contact the development team.
