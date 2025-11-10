# Set Environment Variable in Vercel

## 🔴 Critical: VITE_API_BASE_URL Must Be Set

The "Failed to fetch" error is usually caused by the environment variable not being set in Vercel.

## ✅ Step-by-Step Instructions

### 1. Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Sign in if needed
3. Find your project: **jamii-bolt-frontend**

### 2. Navigate to Environment Variables

1. Click on your project
2. Go to **Settings** (top navigation)
3. Click **Environment Variables** (left sidebar)

### 3. Add Environment Variable

1. Click **"Add New"** button
2. Fill in:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://jamii-backend-production.up.railway.app`
   - **Environments:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. Click **"Save"**

### 4. Redeploy

**Important:** After adding the environment variable, you MUST redeploy for it to take effect.

#### Option A: Redeploy from Dashboard
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait 2-3 minutes

#### Option B: Push a New Commit
```bash
# Make a small change and push
cd frontend-bolt
echo "# Updated" >> README.md
git add README.md
git commit -m "Trigger redeploy"
git push origin main
```

### 5. Verify

After redeploy, check:

1. **In Browser Console (F12):**
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
   ```
   Should show: `https://jamii-backend-production.up.railway.app`

2. **In Network Tab:**
   - Try to sign in
   - Check the request URL
   - Should be: `https://jamii-backend-production.up.railway.app/api/v1/auth/login`

## 🐛 Troubleshooting

### Environment Variable Not Working?

1. **Check spelling:** Must be exactly `VITE_API_BASE_URL` (case-sensitive)
2. **Check environments:** Must be enabled for Production
3. **Redeploy:** Environment variables only apply to NEW deployments
4. **Check build logs:** In Vercel → Deployments → Click deployment → Build Logs

### Still Getting "Failed to fetch"?

1. **Check CORS:** Your Vercel URL might not be in backend CORS
   - See `FIX_VERCEL_DEPLOYMENT_ERRORS.md`
   - Add your Vercel URL to backend CORS or use custom domain

2. **Check Backend:**
   - Visit: `https://jamii-backend-production.up.railway.app/docs`
   - Should show FastAPI docs
   - If not, backend is down

3. **Check Network:**
   - Open browser DevTools (F12)
   - Network tab → Try sign in
   - Check request details and error message

## 📋 Quick Checklist

- [ ] Environment variable `VITE_API_BASE_URL` added in Vercel
- [ ] Value set to: `https://jamii-backend-production.up.railway.app`
- [ ] Enabled for Production environment
- [ ] Redeployed after adding variable
- [ ] Verified in browser console
- [ ] Tested sign in again

---

**Most Common Issue:** Environment variable not set or not redeployed after setting.

