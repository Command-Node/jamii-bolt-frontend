# Fix "Failed to fetch" Error - Vercel Deployment

## 🔴 Problem

Getting "Failed to fetch" error when trying to sign in from Vercel deployment.

## ✅ Solutions

### 1. Check Environment Variable in Vercel

**Critical:** The `VITE_API_BASE_URL` environment variable MUST be set in Vercel.

#### Steps:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project: `jamii-bolt-frontend`

2. **Go to Settings → Environment Variables**

3. **Add/Verify:**
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `https://jamii-backend-production.up.railway.app`
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger redeploy

### 2. Add Vercel URL to Backend CORS

**The issue:** Your Vercel deployment URL (e.g., `jamii-bolt-frontend.vercel.app`) is NOT in the backend's CORS allowed origins.

#### Backend CORS Configuration

The backend (`app/main.py`) currently allows:
- `https://getjamii.com`
- `https://www.getjamii.com`
- `http://localhost:3000`
- `http://localhost:5173`

**But NOT your Vercel URL!**

#### Solution A: Add Vercel URL to Backend CORS (Recommended for Testing)

1. **Find your Vercel URL:**
   - In Vercel Dashboard → Your Project → Settings → Domains
   - Or check your deployment URL (e.g., `jamii-bolt-frontend.vercel.app`)

2. **Update Backend CORS:**
   - Edit `app/main.py`
   - Find the `production_origins` list (around line 170)
   - Add your Vercel URL:
     ```python
     production_origins = [
         "https://getjamii.com",
         "https://www.getjamii.com",
         "http://getjamii.com",
         "http://www.getjamii.com",
         "http://localhost:3000",
         "http://localhost:5173",
         "https://jamii-bolt-frontend.vercel.app",  # Add your Vercel URL
         "https://*.vercel.app",  # Or allow all Vercel preview deployments
     ]
     ```

3. **Deploy Backend:**
   ```bash
   git add app/main.py
   git commit -m "Add Vercel URL to CORS allowed origins"
   git push origin main
   ```

4. **Wait for Railway to redeploy** (2-3 minutes)

#### Solution B: Use Custom Domain (Recommended for Production)

Instead of using the Vercel URL, point `getjamii.com` to your Vercel deployment:

1. **In Vercel Dashboard:**
   - Settings → Domains
   - Add: `getjamii.com`
   - Add: `www.getjamii.com`

2. **Update DNS:**
   - Go to your domain registrar
   - Point `getjamii.com` to Vercel (CNAME to `cname.vercel-dns.com`)
   - Point `www.getjamii.com` to Vercel

3. **Wait for DNS propagation** (up to 48 hours, usually < 1 hour)

4. **Test:**
   - Visit `https://getjamii.com`
   - Sign in should work (CORS already allows this domain)

### 3. Test Backend Connectivity

#### Check if Backend is Responding:

```powershell
# Test backend health
Invoke-WebRequest -Uri "https://jamii-backend-production.up.railway.app/api/v1/auth/me" -Method GET
```

Or in browser:
- Visit: `https://jamii-backend-production.up.railway.app/docs`
- Should show FastAPI docs

#### Test CORS from Browser:

1. Open browser console (F12)
2. Run:
   ```javascript
   fetch('https://jamii-backend-production.up.railway.app/api/v1/auth/me', {
     method: 'GET',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include'
   })
   .then(r => r.json())
   .then(console.log)
   .catch(console.error);
   ```

3. **Check for CORS error:**
   - If you see `Access-Control-Allow-Origin` header → CORS is working
   - If you see CORS error → Backend needs your frontend URL added

### 4. Enhanced Error Messages

The frontend now shows better error messages:

- **Network Error:** Shows backend URL, frontend URL, and possible issues
- **CORS Error:** Indicates CORS configuration problem
- **Backend Down:** Indicates backend is not responding

Check browser console (F12) for detailed error messages.

## 🔍 Debugging Steps

### Step 1: Check Environment Variable

In browser console (F12), run:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```

**Expected:** `https://jamii-backend-production.up.railway.app`  
**If undefined:** Environment variable not set in Vercel

### Step 2: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to sign in
4. Look for the request to `/api/v1/auth/login`
5. Check:
   - **Status:** Should be 200 (not CORS error)
   - **Request URL:** Should be `https://jamii-backend-production.up.railway.app/api/v1/auth/login`
   - **Response Headers:** Should include `Access-Control-Allow-Origin`

### Step 3: Check CORS Headers

In Network tab, check response headers:
- `Access-Control-Allow-Origin` should match your frontend URL
- `Access-Control-Allow-Credentials: true` should be present

## 📋 Quick Checklist

- [ ] `VITE_API_BASE_URL` set in Vercel environment variables
- [ ] Vercel deployment redeployed after setting env var
- [ ] Backend CORS includes your Vercel URL (or use custom domain)
- [ ] Backend is running and accessible
- [ ] Browser console shows correct API base URL
- [ ] Network tab shows CORS headers in response

## 🚀 Quick Fix (Fastest)

1. **Set environment variable in Vercel:**
   - `VITE_API_BASE_URL` = `https://jamii-backend-production.up.railway.app`
   - Redeploy

2. **Add Vercel URL to backend CORS:**
   - Edit `app/main.py` line ~170
   - Add: `"https://jamii-bolt-frontend.vercel.app"` (your actual Vercel URL)
   - Deploy backend

3. **Test:**
   - Try signing in again
   - Check browser console for errors

## 🎯 Long-term Solution

**Use custom domain:**
- Point `getjamii.com` to Vercel deployment
- Backend CORS already allows `getjamii.com`
- No need to update backend CORS for every deployment

---

**Most Common Issue:** Environment variable not set in Vercel or Vercel URL not in backend CORS.

