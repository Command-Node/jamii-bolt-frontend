# Deploy BOLT Frontend to Vercel

## ✅ What's Ready

- ✅ Clean BOLT-only frontend (no Lovable dependencies)
- ✅ Builds successfully
- ✅ All BOLT pages and components included
- ✅ Mock auth context (ready for backend integration)
- ✅ Vercel configuration ready

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Click **"Add New"** → **"Project"**

2. **Import Git Repository:**
   - If you've pushed to GitHub: Select your repository
   - If not: Use Vercel CLI (see Option 2)

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend-bolt` (if in monorepo) or leave blank
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables:**
   - Add: `VITE_API_BASE_URL` = `https://jamii-backend-production.up.railway.app`
   - (Optional) Add other env vars as needed

5. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes

6. **Get Your URL:**
   - Vercel will provide a URL like: `jamii-bolt-frontend.vercel.app`
   - You can add custom domain later

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Login:**
   ```powershell
   vercel login
   ```

3. **Deploy:**
   ```powershell
   cd frontend-bolt
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name: `jamii-bolt-frontend`
   - Directory: `./`
   - Override settings? **No**

5. **Set Environment Variables:**
   ```powershell
   vercel env add VITE_API_BASE_URL
   # Enter: https://jamii-backend-production.up.railway.app
   ```

6. **Deploy to Production:**
   ```powershell
   vercel --prod
   ```

### Option 3: Push to GitHub and Auto-Deploy

1. **Create GitHub Repository:**
   ```powershell
   cd frontend-bolt
   git remote add origin https://github.com/YOUR_USERNAME/jamii-bolt-frontend.git
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to Vercel Dashboard
   - Import the GitHub repository
   - Vercel will auto-detect Vite settings
   - Add environment variables
   - Deploy

## 🔗 Point getjamii.com to New Deployment

Once deployed:

1. **Get Vercel URL:**
   - Your deployment will have a URL like: `jamii-bolt-frontend.vercel.app`

2. **Add Custom Domain:**
   - In Vercel Dashboard → Your Project → Settings → Domains
   - Add: `getjamii.com`
   - Add: `www.getjamii.com`
   - Follow DNS instructions

3. **Update DNS:**
   - Go to your domain registrar
   - Update DNS records as Vercel instructs
   - Usually: Add CNAME record pointing to Vercel

## 📋 What's Included

### Pages (BOLT Only)
- ✅ LandingPage
- ✅ AuthPage
- ✅ MarketplacePage
- ✅ CustomerDashboard
- ✅ HelperDashboard
- ✅ MessagesPage
- ✅ ProfileSettingsPage
- ✅ PaymentsPage
- ✅ JamiiShopPage
- ✅ PublicProfilePage

### Components (BOLT Only)
- ✅ All BOLT components (22 components)
- ✅ No Lovable dependencies

### Dependencies
- ✅ React 18.3.1
- ✅ React Router 6.30.1
- ✅ Lucide React (icons)
- ✅ Tailwind CSS
- ✅ TypeScript
- ✅ Vite

### Removed
- ❌ lovable-tagger
- ❌ All Lovable-specific code
- ❌ Old frontend pages (kept only BOLT)

## 🎯 Next Steps After Deployment

1. **Test the deployment:**
   - Visit your Vercel URL
   - Check all pages load
   - Verify no console errors

2. **Connect to Backend:**
   - Update `src/contexts/AuthContext.tsx` to use your API
   - Replace mock data with real API calls
   - See `BOLT_BACKEND_INTEGRATION.md`

3. **Add Custom Domain:**
   - Point getjamii.com to new Vercel deployment
   - Update DNS records

## 🐛 Troubleshooting

### Build Fails
- Check `npm run build` works locally
- Check Vercel build logs
- Verify all dependencies in package.json

### Pages Don't Load
- Check browser console for errors
- Verify environment variables are set
- Check Vercel deployment logs

### Import Errors
- Verify all import paths are correct
- Check that all components exist
- Run `npm install` to ensure dependencies

## 📝 Project Structure

```
frontend-bolt/
├── src/
│   ├── pages/          # BOLT pages only
│   ├── components/     # BOLT components only
│   ├── contexts/        # Auth context (mock)
│   ├── lib/            # Utilities
│   ├── App.tsx         # Clean app with BOLT routes
│   └── main.tsx
├── package.json        # Clean dependencies (no Lovable)
├── vite.config.ts
├── vercel.json         # Vercel config
└── README.md
```

---

**Ready to deploy!** 🚀

