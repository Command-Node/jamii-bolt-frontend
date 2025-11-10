# Fix "API Error: 0 Network Error" - CORS Issue

## 🔴 Current Error

You're seeing: **"API Error: 0 Network Error"**

This means:
- ✅ Environment variable is likely set (we're getting a more specific error)
- ❌ **CORS is blocking the request** - Your Vercel URL is not in the backend's allowed origins

## ✅ Solution: Add Vercel URL to Backend CORS

### Step 1: Find Your Exact Vercel URL

From the browser URL bar, your Vercel URL is:
- `jamii-bolt-frontend-ddvr1iebx-tdxis-projects.vercel.app` (preview deployment)
- OR `jamii-bolt-frontend.vercel.app` (production)

**Note:** Vercel preview deployments have unique URLs. You need to add the pattern.

### Step 2: Update Backend CORS

Edit `app/main.py` around line 170:

**Current code:**
```python
production_origins = [
    "https://getjamii.com",
    "https://www.getjamii.com",
    "http://getjamii.com",
    "http://www.getjamii.com",
    "http://localhost:3000",
    "http://localhost:5173",
]
```

**Updated code (add Vercel URLs):**
```python
production_origins = [
    "https://getjamii.com",
    "https://www.getjamii.com",
    "http://getjamii.com",
    "http://www.getjamii.com",
    "http://localhost:3000",
    "http://localhost:5173",
    # Vercel deployments
    "https://jamii-bolt-frontend.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel preview deployments
]
```

**However:** FastAPI's CORSMiddleware doesn't support wildcards when `allow_credentials=True`.

**Better solution - Add specific patterns:**
```python
production_origins = [
    "https://getjamii.com",
    "https://www.getjamii.com",
    "http://getjamii.com",
    "http://www.getjamii.com",
    "http://localhost:3000",
    "http://localhost:5173",
    # Vercel production
    "https://jamii-bolt-frontend.vercel.app",
    # Vercel preview deployments (add common patterns)
    "https://jamii-bolt-frontend-*.vercel.app",
]
```

**But wait:** FastAPI doesn't support wildcards. We need to handle this differently.

### Step 3: Update Backend CORS to Handle Vercel URLs Dynamically

Update `app/main.py` to allow Vercel URLs:

```python
# Around line 180, after production_origins list:
production_origins = [
    "https://getjamii.com",
    "https://www.getjamii.com",
    "http://getjamii.com",
    "http://www.getjamii.com",
    "http://localhost:3000",
    "http://localhost:5173",
]

# Add Vercel URLs dynamically
vercel_patterns = [
    "https://jamii-bolt-frontend.vercel.app",
    # Add your specific preview URL if needed
    "https://jamii-bolt-frontend-ddvr1iebx-tdxis-projects.vercel.app",
]

# Combine all origins
cors_origins = list(production_origins) + vercel_patterns
```

### Step 4: Update Custom CORS Middleware

The custom CORS middleware (around line 232) needs to handle Vercel URLs:

```python
def _is_origin_allowed(self, origin: str) -> bool:
    """Check if origin is allowed, with case-insensitive matching."""
    if not origin:
        return False
    
    # Normalize origin
    origin_normalized = origin.lower().rstrip('/')
    
    # Check exact matches
    for allowed in self.allowed_origins:
        if allowed.lower().rstrip('/') == origin_normalized:
            return True
    
    # Check Vercel pattern: *.vercel.app
    if origin_normalized.endswith('.vercel.app'):
        # Allow any Vercel deployment
        return True
    
    return False
```

### Step 5: Deploy Backend

```bash
git add app/main.py
git commit -m "Add Vercel URLs to CORS allowed origins"
git push origin main
```

Wait 2-3 minutes for Railway to redeploy.

## 🎯 Alternative: Use Custom Domain (Recommended)

Instead of adding Vercel URLs to CORS, point `getjamii.com` to Vercel:

1. **In Vercel Dashboard:**
   - Settings → Domains
   - Add: `getjamii.com`
   - Add: `www.getjamii.com`

2. **Update DNS:**
   - Point `getjamii.com` to Vercel
   - Backend CORS already allows `getjamii.com`

3. **No backend changes needed!**

## 🔍 Verify CORS is Fixed

After backend redeploys:

1. **Try signing up again**
2. **Check browser console (F12):**
   - Network tab → Look for the request
   - Response headers should include: `Access-Control-Allow-Origin: https://jamii-bolt-frontend-*.vercel.app`

## 📋 Quick Fix Checklist

- [ ] Find your exact Vercel URL from browser
- [ ] Update `app/main.py` to allow Vercel URLs
- [ ] Update custom CORS middleware to handle `*.vercel.app`
- [ ] Deploy backend changes
- [ ] Test sign-up again
- [ ] OR: Use custom domain instead (no backend changes)

---

**Most Likely Issue:** Vercel URL not in backend CORS allowed origins.

