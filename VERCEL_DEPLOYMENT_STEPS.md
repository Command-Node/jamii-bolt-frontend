# Deploy BOLT Frontend to Vercel - Step by Step

## ✅ Repository Ready

Your GitHub repository is ready:
- **Repository:** https://github.com/Command-Node/jamii-bolt-frontend
- **Code pushed:** ✅

## 🚀 Deploy to Vercel

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**

### Step 2: Import Repository

1. **Find your repository:**
   - Search for: `jamii-bolt-frontend`
   - Or: `Command-Node/jamii-bolt-frontend`
   - Click **"Import"**

### Step 3: Configure Project

Vercel should auto-detect these settings, but verify:

- **Framework Preset:** `Vite` ✅
- **Root Directory:** `./` (leave blank or set to `./`)
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install` ✅

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

**Variable 1:**
- Name: `VITE_API_BASE_URL`
- Value: `https://jamii-backend-production.up.railway.app`
- Environments: ✅ Production, ✅ Preview, ✅ Development

**Variable 2 (Optional - for future use):**
- Name: `VITE_BACKEND_URL`
- Value: `https://jamii-backend-production.up.railway.app`
- Environments: ✅ Production, ✅ Preview, ✅ Development

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `jamii-bolt-frontend.vercel.app`

### Step 6: Add Custom Domain

Once deployed:

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `getjamii.com`
4. Click **"Add"**
5. Enter: `www.getjamii.com`
6. Click **"Add"**

### Step 7: Update DNS

Vercel will show DNS instructions. Typically:

**For getjamii.com:**
- Type: `A` or `CNAME`
- Name: `@` or `getjamii.com`
- Value: Vercel's IP or CNAME (they'll provide)

**For www.getjamii.com:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com` (or what Vercel provides)

**Where to update:**
- Go to your domain registrar (where you bought getjamii.com)
- Find DNS settings
- Add/update the records as Vercel instructs

### Step 8: Verify Deployment

1. Visit your Vercel URL: `jamii-bolt-frontend.vercel.app`
2. You should see the BOLT landing page
3. Test navigation: Click "Let's Jamii" → Should go to marketplace
4. Check browser console for errors

## 🎯 After Deployment

### Test the Site

1. **Landing Page:** Should show BOLT UI with orange/green gradient
2. **Navigation:** All buttons should work
3. **No Errors:** Check browser console (F12)

### Connect Backend (Next Step)

The UI will show but data will be empty. To connect:

1. Update `src/contexts/AuthContext.tsx` to use your API
2. Replace mock data with real API calls
3. See `BOLT_BACKEND_INTEGRATION.md` for details

## 📋 Quick Reference

**Repository:** https://github.com/Command-Node/jamii-bolt-frontend  
**Vercel Dashboard:** https://vercel.com/dashboard  
**Backend API:** https://jamii-backend-production.up.railway.app

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify `npm run build` works locally
- Check for missing dependencies

### Domain Not Working
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check Vercel domain settings

### Pages Show Empty
- This is expected - backend not connected yet
- See `BOLT_BACKEND_INTEGRATION.md` to connect API

---

**Ready to deploy!** 🚀

Go to Vercel Dashboard and import your repository.

