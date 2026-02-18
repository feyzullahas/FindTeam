# 🚀 SECURE DEPLOYMENT GUIDE

## ⚠️ CRITICAL: IMMEDIATE DEPLOYMENT STEPS

Your application was compromised due to security vulnerabilities. Follow these steps **IMMEDIATELY** to secure your deployment.

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. Verify All Security Fixes Are Applied

Check that these files have been updated:
- [x] `backend/.env` - New strong SECRET_KEY
- [x] `backend/app/main.py` - Docs disabled, CORS restricted
- [x] `backend/app/core/security.py` - Enhanced token verification
- [x] `backend/app/core/config.py` - SECRET_KEY validation
- [x] `backend/app/middleware/security.py` - Rate limiting added
- [x] `backend/app/core/auth_utils.py` - Enhanced auth utilities

### 2. Verify .env Is NOT in Git

```bash
cd backend
git status | grep .env
# Should show nothing or "Untracked files"

# If .env is tracked, run:
git rm --cached .env
echo "backend/.env" >> ../.gitignore
git add ../.gitignore
git commit -m "Ensure .env is never committed"
```

### 3. Generate a NEW Unique SECRET_KEY

**IMPORTANT:** Do NOT use the SECRET_KEY in the committed `.env` file. Generate your own:

```bash
# Method 1: Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Method 2: Using OpenSSL
openssl rand -base64 32

# Method 3: Using /dev/urandom (Linux/Mac)
head -c 32 /dev/urandom | base64
```

**Save this key securely!** You'll need it for the next steps.

---

## 🔐 RENDER.COM DEPLOYMENT (Production)

### Step 1: Update Environment Variables

1. **Login to Render Dashboard:**
   - Go to https://dashboard.render.com
   - Select your FastAPI service

2. **Update Environment Variables:**
   Click "Environment" tab and set:

   ```bash
   # CRITICAL: Use YOUR OWN generated key, not this example!
   SECRET_KEY=<YOUR_GENERATED_KEY_FROM_STEP_3>
   
   # Set to production
   ENVIRONMENT=production
   
   # Database (keep your existing DATABASE_URL or rotate it)
   DATABASE_URL=postgresql://...
   
   # Google OAuth (rotate these if compromised)
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   GOOGLE_REDIRECT_URI=https://findteam.onrender.com/auth/google/callback
   
   # JWT Settings
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=10080
   
   # Frontend URL
   FRONTEND_URL=https://findteam-ten.vercel.app
   
   # Debug (disable in production)
   DEBUG=false
   ```

3. **Save and Redeploy:**
   - Click "Save Changes"
   - Render will automatically redeploy
   - Wait for deployment to complete

### Step 2: Verify Deployment

After deployment completes:

```bash
# Test 1: Swagger should be disabled
curl https://findteam.onrender.com/docs
# Expected: 404 Not Found

# Test 2: Root endpoint should work
curl https://findteam.onrender.com/
# Expected: {"status": "API çalışıyor"}

# Test 3: Check security headers
curl -I https://findteam.onrender.com/
# Expected: Should see X-Frame-Options, X-Content-Type-Options, etc.
```

### Step 3: Monitor Logs

```bash
# On Render dashboard, check logs for:
# ✅ "Security validation passed: Strong SECRET_KEY detected"
# ❌ No error messages about weak keys
```

---

## 🔄 CREDENTIAL ROTATION

### 1. Rotate Database Password (Recommended)

**Neon.tech:**
1. Go to https://console.neon.tech
2. Select your project → Settings
3. Click "Reset Password"
4. Copy new password
5. Update `DATABASE_URL` in Render environment variables:
   ```
   postgresql://neondb_owner:<NEW_PASSWORD>@ep-solitary-frog-agikb3xd-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Rotate Google OAuth Credentials (If Compromised)

**Google Cloud Console:**
1. Go to https://console.cloud.google.com
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Delete old OAuth 2.0 Client ID
5. Create new OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized redirect URIs: `https://findteam.onrender.com/auth/google/callback`
6. Copy new Client ID and Client Secret
7. Update in Render environment variables

---

## 📊 POST-DEPLOYMENT VERIFICATION

### 1. Test Authentication

```bash
# Test login endpoint
curl -X POST https://findteam.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Should return JWT token or 401 if credentials invalid
```

### 2. Test Protected Endpoints

```bash
# Try accessing protected endpoint without token
curl https://findteam.onrender.com/posts/my

# Expected: 401 Unauthorized
```

### 3. Test Rate Limiting

```bash
# Make 101 rapid requests
for i in {1..101}; do
  curl https://findteam.onrender.com/ &
done

# Last requests should return 429 Too Many Requests
```

### 4. Verify CORS

```bash
# Request from unauthorized origin
curl -H "Origin: https://malicious-site.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://findteam.onrender.com/posts/

# Should NOT include Access-Control-Allow-Origin header
```

---

## 🗄️ DATABASE RECOVERY

### Option 1: Restore from Backup (Recommended)

If you have a backup before the attack:

**Neon.tech:**
1. Go to console.neon.tech
2. Select your project
3. Click "Restore" or "Point-in-time Recovery"
4. Select date/time before attack
5. Restore to new branch or overwrite

### Option 2: Manual Cleanup

If no backup exists, you'll need to manually review and fix posts:

```sql
-- Connect to database
-- Review compromised posts
SELECT id, title, description, created_at, user_id 
FROM posts 
WHERE title LIKE '%MALICIOUS_TEXT%' 
   OR description LIKE '%MALICIOUS_TEXT%';

-- Option A: Delete all compromised posts
DELETE FROM posts 
WHERE title LIKE '%MALICIOUS_TEXT%' 
   OR description LIKE '%MALICIOUS_TEXT%';

-- Option B: Mark as inactive
UPDATE posts 
SET status = 'closed' 
WHERE title LIKE '%MALICIOUS_TEXT%' 
   OR description LIKE '%MALICIOUS_TEXT%';
```

### Option 3: Contact Users

If you have user contact info:
1. Email all users about the incident
2. Ask them to review and repost their listings
3. Apologize and explain security improvements made

---

## 🔍 MONITORING & ALERTS

### Set Up Monitoring (Highly Recommended)

**1. Error Tracking - Sentry:**
```bash
pip install sentry-sdk[fastapi]
```

Add to `main.py`:
```python
import sentry_sdk

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    traces_sample_rate=0.1,
    environment=settings.ENVIRONMENT,
)
```

**2. Uptime Monitoring:**
- Use Render's built-in health checks
- Or set up external monitoring: UptimeRobot, Pingdom

**3. Log Aggregation:**
- Render provides built-in log viewing
- For advanced needs: Logtail, Papertrail

### Set Up Alerts

Create alerts for:
- Failed authentication attempts > 10/minute
- 500 errors
- High rate limit violations
- Database connection failures

---

## 🔒 ONGOING SECURITY PRACTICES

### Daily
- [ ] Review Render logs for errors/anomalies
- [ ] Check for failed authentication attempts

### Weekly
- [ ] Review user reports
- [ ] Check for suspicious posts
- [ ] Verify security headers still active

### Monthly
- [ ] Update dependencies: `pip list --outdated`
- [ ] Review and rotate JWT secret (optional but recommended)
- [ ] Run security audit

### Quarterly
- [ ] Full penetration testing
- [ ] Review all access controls
- [ ] Audit user permissions

---

## 🚨 INCIDENT RESPONSE PLAN

If you detect another security incident:

### Immediate Actions (0-15 minutes)
1. **Disable API access:**
   ```bash
   # On Render: Set environment variable
   MAINTENANCE_MODE=true
   ```
   
2. **Capture evidence:**
   - Download logs from Render
   - Take database snapshot
   - Document timeline

3. **Rotate credentials:**
   - Generate new SECRET_KEY
   - Update in Render
   - Redeploy

### Short-term (15-60 minutes)
4. **Identify scope:**
   - How many users affected?
   - What data was compromised?
   - How did attacker gain access?

5. **Contain damage:**
   - Restore from backup
   - Or manually fix compromised data

6. **Notify stakeholders:**
   - Prepare user notification
   - Update status page

### Long-term (1-24 hours)
7. **Fix vulnerability:**
   - Identify root cause
   - Implement fix
   - Test thoroughly

8. **Deploy fix:**
   - Update environment variables
   - Redeploy application
   - Verify fix works

9. **Post-mortem:**
   - Document incident
   - Identify lessons learned
   - Update security practices

---

## 📞 SUPPORT CONTACTS

### If You Need Help

**Render Support:**
- Dashboard: https://dashboard.render.com
- Support: support@render.com
- Docs: https://render.com/docs

**Neon.tech Support:**
- Console: https://console.neon.tech
- Support: support@neon.tech
- Docs: https://neon.tech/docs

**Google OAuth Issues:**
- Console: https://console.cloud.google.com
- Support: https://support.google.com

---

## ✅ DEPLOYMENT COMPLETE CHECKLIST

After completing all steps above, verify:

- [ ] New SECRET_KEY generated and set in Render
- [ ] ENVIRONMENT=production set
- [ ] Swagger disabled (404 at /docs)
- [ ] CORS restricted to frontend domain only
- [ ] Security headers present in responses
- [ ] Rate limiting active (429 after 100 req/min)
- [ ] Database credentials rotated (optional but recommended)
- [ ] Google OAuth credentials rotated (if compromised)
- [ ] .env file NOT in Git
- [ ] All users can login successfully
- [ ] Protected endpoints require authentication
- [ ] Monitoring/alerts configured
- [ ] Database restored or cleaned
- [ ] Team notified of changes
- [ ] Documentation updated

---

## 🎯 SUCCESS CRITERIA

Your deployment is secure when:

1. ✅ Swagger returns 404
2. ✅ Weak JWT tokens are rejected
3. ✅ CORS only allows your frontend
4. ✅ Rate limiting blocks excessive requests
5. ✅ Security headers present in all responses
6. ✅ All existing tokens invalidated (users must re-login)
7. ✅ No sensitive data in logs
8. ✅ .env file excluded from Git

---

## 📚 ADDITIONAL RESOURCES

- [FastAPI Security Best Practices](https://fastapi.tiangolo.com/tutorial/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Render Deployment Guide](https://render.com/docs/deploy-fastapi)

---

**Last Updated:** February 18, 2026
**Version:** 1.0
**Status:** CRITICAL - DEPLOY IMMEDIATELY
