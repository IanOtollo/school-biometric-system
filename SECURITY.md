# 🔒 Security Guidelines

Security best practices and compliance information for the School Biometric Access System.

## 🎯 Overview

This document covers security considerations, privacy compliance, and best practices for deploying and maintaining your biometric access control system.

---

## 🛡️ Security Architecture

### Data Flow

```
Camera → Browser → face-api.js → Face Descriptor (128D vector)
                                         ↓
                                   Supabase (Encrypted)
                                         ↓
                                  Verification Engine
                                         ↓
                                   Access Decision
```

### Security Layers

1. **Client-Side**
   - HTTPS only
   - Camera permissions
   - Input validation
   - XSS protection

2. **Transport**
   - TLS 1.3
   - Certificate validation
   - Secure WebSocket (for real-time)

3. **Database**
   - Row Level Security (RLS)
   - Encrypted at rest
   - Encrypted in transit
   - Regular backups

4. **Application**
   - Environment variables
   - API key rotation
   - Rate limiting
   - Error handling

---

## 🔐 Authentication & Authorization

### Supabase RLS Policies

#### Production-Ready Policies

Replace the permissive policies in `database-schema.sql` with these:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for all users" ON users;
DROP POLICY IF EXISTS "Enable update for all users" ON users;
DROP POLICY IF EXISTS "Enable delete for all users" ON users;

-- Authenticated users can read all users
CREATE POLICY "Authenticated users can read users" ON users
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only admins can insert users
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Only admins can update users
CREATE POLICY "Admins can update users" ON users
    FOR UPDATE USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Only admins can delete users
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        auth.jwt() ->> 'role' = 'admin'
    );

-- Access logs - read for authenticated
CREATE POLICY "Authenticated users can read logs" ON access_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Access logs - anyone can insert (for verification)
CREATE POLICY "Anyone can insert logs" ON access_logs
    FOR INSERT WITH CHECK (true);
```

### API Key Management

#### Development
```javascript
// Use anon key (read-only)
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

#### Production - Admin Functions
```javascript
// Use service role key (full access)
// Only on server-side, NEVER in client code
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

### Key Rotation

1. **Monthly**: Rotate Supabase API keys
2. **After breach**: Immediate rotation
3. **Staff changes**: Review and rotate

```bash
# Generate new keys in Supabase dashboard
# Update environment variables
# Redeploy application
```

---

## 🔒 Data Protection

### Face Descriptors

Face descriptors are 128-dimensional vectors (not images):
- Cannot be reverse-engineered to recreate faces
- Anonymous by design
- Stored as encrypted arrays

### Sensitive Data

| Data Type | Storage | Encryption | Access |
|-----------|---------|------------|---------|
| Face Descriptor | Supabase | At rest | RLS |
| Personal Info | Supabase | At rest | RLS |
| Access Logs | Supabase | At rest | RLS |
| Camera Feed | Local only | N/A | Browser |

### Data Retention

```sql
-- Auto-delete old logs after 90 days
CREATE OR REPLACE FUNCTION auto_cleanup_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM access_logs
    WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron
SELECT cron.schedule(
    'cleanup-old-logs',
    '0 2 * * *',  -- 2 AM daily
    $$SELECT auto_cleanup_logs()$$
);
```

---

## 🌍 Privacy & Compliance

### GDPR Compliance

#### Requirements Met

✅ **Consent**: Obtain explicit consent before enrollment
✅ **Purpose**: Clear purpose for data collection
✅ **Minimization**: Only collect necessary data
✅ **Security**: Appropriate security measures
✅ **Retention**: Automatic data deletion
✅ **Access**: Users can request their data
✅ **Deletion**: Right to be forgotten

#### Implementation

**Consent Form** (add to registration):

```javascript
const [consent, setConsent] = useState(false);

// In registration form:
<label>
  <input
    type="checkbox"
    checked={consent}
    onChange={(e) => setConsent(e.target.checked)}
    required
  />
  I consent to the collection and processing of my biometric data
  for access control purposes. I understand I can withdraw consent
  and request deletion at any time.
</label>
```

**Data Export** (add to dashboard):

```javascript
const exportUserData = async (userId) => {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id_number', userId)
    .single();

  const { data: logs } = await supabase
    .from('access_logs')
    .select('*')
    .eq('user_id', userId);

  const userData = {
    personal: user,
    logs: logs,
    exportDate: new Date().toISOString()
  };

  // Download as JSON
  const blob = new Blob([JSON.stringify(userData, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `user-data-${userId}.json`;
  a.click();
};
```

**Data Deletion**:

```javascript
const deleteUserData = async (userId) => {
  // Delete user
  await supabase
    .from('users')
    .delete()
    .eq('id_number', userId);

  // Delete logs
  await supabase
    .from('access_logs')
    .delete()
    .eq('user_id', userId);
};
```

### Local Regulations

#### United States
- **FERPA**: Protect student educational records
- **BIPA** (Illinois): Biometric Information Privacy Act
- **State laws**: Check local biometric regulations

#### European Union
- **GDPR**: General Data Protection Regulation
- **Data Protection Impact Assessment** required

#### Other Regions
- **Canada**: PIPEDA compliance
- **Australia**: Privacy Act 1988
- **UK**: UK GDPR + DPA 2018

### Privacy Policy Template

```markdown
# Privacy Policy - Biometric Access System

## Data Collection
We collect:
- Your name and ID number
- Your role (student/lecturer/staff)
- Contact email (optional)
- Facial biometric data (encrypted descriptor)
- Access logs (timestamp, location)

## Purpose
Data is used solely for:
- School access control
- Security monitoring
- Attendance tracking

## Data Storage
- Stored securely in Supabase
- Encrypted at rest and in transit
- Access restricted to administrators

## Your Rights
You have the right to:
- Access your data
- Request correction
- Request deletion
- Withdraw consent
- Export your data

## Contact
For privacy concerns: privacy@yourschool.edu
Data Protection Officer: dpo@yourschool.edu

## Retention
- Access logs: 90 days
- User data: Until account deletion requested
```

---

## 🚨 Incident Response

### Security Incident Plan

#### 1. Detection
- Monitor unusual access patterns
- Review Supabase logs
- Check error rates

#### 2. Assessment
- Identify affected data
- Determine breach scope
- Classify severity

#### 3. Containment
```bash
# Immediately rotate keys
# Update in Supabase dashboard
# Redeploy with new keys

# Temporarily disable system if needed
# Add maintenance page
```

#### 4. Notification
- Notify affected users within 72 hours (GDPR)
- Contact authorities if required
- Document incident

#### 5. Recovery
- Restore from backups if needed
- Implement additional security measures
- Update security policies

#### 6. Review
- Conduct post-mortem
- Update documentation
- Improve security measures

### Incident Response Contacts

```
Security Team: security@yourschool.edu
System Admin: admin@yourschool.edu
Legal: legal@yourschool.edu
Supabase Support: support@supabase.com
```

---

## 🔍 Security Monitoring

### Supabase Dashboard Monitoring

1. **Database Metrics**
   - Connection count
   - Query performance
   - Storage usage

2. **API Metrics**
   - Request count
   - Error rates
   - Response times

3. **Authentication**
   - Failed login attempts
   - Active sessions
   - Token usage

### Application Monitoring

```javascript
// Add error tracking
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // Send to monitoring service
});

// Track failed verifications
const trackFailedVerification = async () => {
  await supabase.from('security_events').insert({
    event_type: 'failed_verification',
    timestamp: new Date().toISOString(),
    ip_address: await getClientIP()
  });
};
```

### Alerts Setup

```sql
-- Create security events table
CREATE TABLE security_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert on multiple failed attempts
CREATE OR REPLACE FUNCTION check_failed_attempts()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT COUNT(*)
        FROM security_events
        WHERE event_type = 'failed_verification'
        AND timestamp > NOW() - INTERVAL '5 minutes'
    ) > 5 THEN
        -- Send alert (integrate with notification service)
        RAISE WARNING 'Multiple failed verification attempts detected';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER failed_attempts_trigger
    AFTER INSERT ON security_events
    FOR EACH ROW
    EXECUTE FUNCTION check_failed_attempts();
```

---

## 🛠️ Security Tools

### Recommended Tools

1. **Vulnerability Scanning**
```bash
npm install -g snyk
snyk test
snyk monitor
```

2. **Dependency Audit**
```bash
npm audit
npm audit fix
```

3. **Code Quality**
```bash
npm install -g eslint
eslint src/
```

4. **HTTPS Testing**
```bash
# Test SSL configuration
curl -I https://your-domain.com
# Use SSL Labs: https://www.ssllabs.com/ssltest/
```

### Security Headers

Add to Netlify/Vercel config:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=*, geolocation=(), microphone=()"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co"
```

---

## 📋 Security Checklist

### Development Phase
- [ ] Use environment variables for secrets
- [ ] Never commit credentials to Git
- [ ] Use `.gitignore` for sensitive files
- [ ] Enable Supabase RLS
- [ ] Implement input validation
- [ ] Add rate limiting
- [ ] Use HTTPS in development

### Pre-Deployment
- [ ] Security audit completed
- [ ] Dependency vulnerabilities fixed
- [ ] HTTPS certificate ready
- [ ] Database policies tested
- [ ] Privacy policy created
- [ ] User consent mechanism added
- [ ] Backup strategy in place

### Post-Deployment
- [ ] Monitor logs regularly
- [ ] Set up security alerts
- [ ] Schedule key rotation
- [ ] Document incident response
- [ ] Train administrators
- [ ] Regular security reviews
- [ ] Update dependencies monthly

### Ongoing Maintenance
- [ ] Weekly: Review access logs
- [ ] Monthly: Update dependencies
- [ ] Quarterly: Security audit
- [ ] Annually: Compliance review
- [ ] As needed: Incident response

---

## 🎓 Security Training

### For Administrators

Topics to cover:
1. System architecture
2. Privacy regulations
3. Incident response
4. User management
5. Access log review
6. Emergency procedures

### For Users

Topics to cover:
1. How the system works
2. Privacy protections
3. Their rights (GDPR, etc.)
4. How to report issues
5. Best practices for use

### For IT Staff

Topics to cover:
1. Deployment procedures
2. Security monitoring
3. Key rotation
4. Database management
5. Troubleshooting
6. Performance optimization

---

## 📞 Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@yourschool.edu
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 24 hours.

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [GDPR Compliance](https://gdpr.eu/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Security is everyone's responsibility.** Stay vigilant and report issues promptly.
