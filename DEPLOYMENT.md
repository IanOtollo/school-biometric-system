# 🚀 Deployment Guide

Comprehensive guide to deploying your School Biometric Access System to production.

## 🔒 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Supabase database is set up and tested
- [ ] Environment variables are configured
- [ ] Face-API models are included in build
- [ ] Application tested locally
- [ ] Security policies reviewed
- [ ] Privacy policy in place
- [ ] User consent mechanism implemented
- [ ] HTTPS certificate ready (required for camera access)

## 🌐 Deployment Options Comparison

| Platform | Difficulty | Cost | HTTPS | CI/CD | Best For |
|----------|-----------|------|-------|-------|----------|
| Vercel | ⭐ Easy | Free tier | ✅ Auto | ✅ Yes | Quick deployment |
| Netlify | ⭐ Easy | Free tier | ✅ Auto | ✅ Yes | Static sites |
| GitHub Pages | ⭐⭐ Medium | Free | ✅ Yes | ⚠️ Manual | Open source |
| DigitalOcean | ⭐⭐⭐ Hard | $5+/mo | ⚠️ Setup | ⚠️ Manual | Full control |
| AWS | ⭐⭐⭐⭐ Expert | Variable | ⚠️ Setup | ✅ Yes | Enterprise |
| Docker | ⭐⭐⭐ Hard | Variable | ⚠️ Setup | ⚠️ Manual | Flexibility |

---

## 1️⃣ Vercel Deployment (Recommended)

### Why Vercel?
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Free tier sufficient for most schools
- ✅ Environment variables management
- ✅ Perfect for React/Vite apps

### Step-by-Step Guide

#### A. Via Web Interface (Easiest)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables**
   - In project settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your anon key

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site is live at `https://your-project.vercel.app`

#### B. Via CLI (Developer)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? school-biometric-system
# - Directory? ./
# - Override settings? No

# For production:
vercel --prod
```

### Custom Domain Setup

1. In Vercel dashboard → Domains
2. Add your domain (e.g., `access.yourschool.edu`)
3. Update DNS records as instructed:
   - Type: `A` or `CNAME`
   - Value: Provided by Vercel
4. Wait for DNS propagation (~24 hours)

### Vercel Configuration File

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/models/(.*)",
      "dest": "/models/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

---

## 2️⃣ Netlify Deployment

### Step-by-Step Guide

#### A. Via Web Interface

1. **Push to GitHub** (same as Vercel)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository

3. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variables

4. **Deploy**

#### B. Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=*, microphone=()"
```

---

## 3️⃣ DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- Domain name
- SSH access knowledge

### Step 1: Create Droplet

1. Create Ubuntu 22.04 droplet ($5/month)
2. Choose datacenter region closest to you
3. Add SSH key
4. Create droplet

### Step 2: Initial Server Setup

```bash
# SSH into server
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Create non-root user
adduser biometric
usermod -aG sudo biometric
su - biometric
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Create .env file
nano .env
# Add your Supabase credentials

# Build
npm run build
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/biometric
```

Add:

```nginx
server {
    listen 80;
    server_name access.yourschool.edu;

    root /home/biometric/your-repo/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /models {
        alias /home/biometric/your-repo/dist/models;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/biometric /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL

```bash
sudo certbot --nginx -d access.yourschool.edu
```

### Step 6: Setup Auto-Updates (Optional)

```bash
# Create update script
nano ~/update-app.sh
```

Add:

```bash
#!/bin/bash
cd /home/biometric/your-repo
git pull
npm install
npm run build
sudo systemctl restart nginx
```

Make executable:

```bash
chmod +x ~/update-app.sh
```

---

## 4️⃣ Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /models {
        alias /usr/share/nginx/html/models;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  biometric-app:
    build: .
    ports:
      - "80:80"
      - "443:443"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
```

### Build and Run

```bash
# Build image
docker build -t biometric-system .

# Run container
docker run -d -p 80:80 -p 443:443 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  biometric-system

# Or use docker-compose
docker-compose up -d
```

---

## 5️⃣ AWS Deployment (Advanced)

### Services Needed
- S3 (Static hosting)
- CloudFront (CDN)
- Certificate Manager (SSL)
- Route 53 (DNS)

### Step 1: Build Application

```bash
npm run build
```

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://school-biometric-system
aws s3 sync dist/ s3://school-biometric-system
```

### Step 3: Configure S3 for Static Hosting

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::school-biometric-system/*"
    }
  ]
}
```

### Step 4: Create CloudFront Distribution

- Origin: Your S3 bucket
- Viewer Protocol Policy: Redirect HTTP to HTTPS
- Allowed HTTP Methods: GET, HEAD, OPTIONS
- Cached HTTP Methods: GET, HEAD, OPTIONS
- Default Root Object: index.html

### Step 5: Request SSL Certificate

Use AWS Certificate Manager for your domain.

---

## 📱 Mobile App Deployment (Optional)

### Using Capacitor

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build web assets
npm run build

# Sync
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

---

## 🔒 Production Security Checklist

### Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No hardcoded credentials
- [ ] Different keys for dev/prod

### HTTPS
- [ ] SSL certificate installed
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header enabled

### Database
- [ ] RLS policies enabled
- [ ] Row-level security configured
- [ ] Backup system in place
- [ ] Connection limits set

### Application
- [ ] Error messages don't expose system details
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CORS properly configured

### Camera Access
- [ ] Camera permissions handled gracefully
- [ ] Fallback for denied permissions
- [ ] Privacy notice displayed

---

## 📊 Monitoring & Maintenance

### Setup Monitoring

1. **Supabase Dashboard**
   - Monitor database performance
   - Check API usage
   - Review logs

2. **Vercel/Netlify Analytics**
   - Track page views
   - Monitor performance
   - Check error rates

3. **Sentry (Optional)**
```bash
npm install @sentry/react @sentry/vite-plugin

# Add to vite.config.js
import { sentryVitePlugin } from "@sentry/vite-plugin";
```

### Regular Maintenance

```bash
# Update dependencies monthly
npm outdated
npm update

# Security audit
npm audit
npm audit fix

# Check bundle size
npm run build -- --mode production
```

### Backup Strategy

1. **Database Backups**
   - Supabase: Automatic daily backups (Pro plan)
   - Manual: Export data regularly

2. **Code Backups**
   - Git repository (already done)
   - Multiple remotes recommended

---

## 🆘 Troubleshooting Deployments

### Build Fails

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 16+

# Verify build locally
npm run build
```

### Environment Variables Not Working

- Ensure prefix is `VITE_` for Vite
- Restart build after adding variables
- Check variable names (case-sensitive)

### Models Not Loading

```bash
# Verify models in build
ls dist/models/

# Check public folder structure
public/
  models/
    *.json
    *-shard*
```

### HTTPS Issues

- Camera requires HTTPS in production
- Use Vercel/Netlify for automatic HTTPS
- For custom server, ensure SSL certificate is valid

---

## 🎯 Performance Optimization

### Bundle Size Reduction

```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'face-api': ['face-api.js'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  }
});
```

### Asset Optimization

```bash
# Compress models (if too large)
# Consider serving from CDN

# Optimize images
npm install --save-dev imagemin imagemin-webp
```

### Caching Strategy

```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /models {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 📈 Scaling Considerations

### For 500+ Users
- Use Vercel Pro ($20/mo)
- Enable caching
- Optimize database queries
- Consider Redis for session management

### For 5000+ Users
- Move to dedicated server
- Load balancing
- Database read replicas
- CDN for assets

### For 10000+ Users
- Kubernetes deployment
- Microservices architecture
- Distributed caching
- Multiple database instances

---

## 🎓 Best Practices

1. **Test Before Deploy**
   - Test all features
   - Check on multiple devices
   - Verify camera access

2. **Gradual Rollout**
   - Start with small group
   - Monitor performance
   - Gather feedback
   - Scale gradually

3. **Documentation**
   - Document deployment process
   - Create user guide
   - Train administrators
   - Provide support contact

4. **Regular Updates**
   - Security patches
   - Feature updates
   - Performance improvements
   - User feedback integration

---

## 📞 Support

If you encounter issues during deployment:

1. Check this guide thoroughly
2. Review platform-specific documentation
3. Check GitHub issues
4. Contact support team

---

**Deployment success!** 🎉

Your biometric access system is now live and ready to secure your school.
