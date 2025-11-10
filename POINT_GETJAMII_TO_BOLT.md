# Point getjamii.com to New BOLT Frontend

## 🔴 Current Issue

`getjamii.com` is still pointing to the **old Vercel project** (with Lovable code), not the new clean BOLT frontend.

## ✅ Solution: Update Domain in Vercel

### Step 1: Go to New BOLT Project in Vercel

1. **Open Vercel Dashboard:** https://vercel.com/dashboard
2. **Select project:** `jamii-bolt-frontend` (the new clean BOLT project)

### Step 2: Add Custom Domain

1. **Go to Settings:**
   - Click on your project: `jamii-bolt-frontend`
   - Click **Settings** (top navigation)
   - Click **Domains** (left sidebar)

2. **Add Domain:**
   - Click **"Add Domain"** button
   - Enter: `getjamii.com`
   - Click **"Add"**

3. **Add WWW Domain:**
   - Click **"Add Domain"** again
   - Enter: `www.getjamii.com`
   - Click **"Add"**

### Step 3: Update DNS (If Needed)

Vercel will show you DNS instructions. You may need to:

1. **Go to your domain registrar** (where you bought getjamii.com)
2. **Update DNS records:**
   - **For getjamii.com:**
     - Type: `A` or `CNAME`
     - Name: `@` or `getjamii.com`
     - Value: Vercel will provide (usually `76.76.21.21` for A record, or `cname.vercel-dns.com` for CNAME)
   
   - **For www.getjamii.com:**
     - Type: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com` (or what Vercel provides)

3. **Wait for DNS propagation** (usually 5-60 minutes, can take up to 48 hours)

### Step 4: Remove Domain from Old Project (Important!)

1. **Go to old Vercel project** (the one currently serving getjamii.com)
2. **Settings → Domains**
3. **Remove** `getjamii.com` and `www.getjamii.com` from the old project
4. This prevents conflicts

### Step 5: Verify

After DNS propagates:

1. **Visit:** `https://getjamii.com`
2. **Should see:** New BOLT UI (orange/green gradient, "Your community, connected")
3. **Should NOT see:** Old Lovable UI

## 🎯 Quick Alternative: Check Current Domain Settings

If you're not sure which project has the domain:

1. **In Vercel Dashboard:**
   - Search for `getjamii.com` in the search bar
   - It will show which project has the domain

2. **Or check each project:**
   - Go to each project → Settings → Domains
   - See which one lists `getjamii.com`

## 📋 Checklist

- [ ] Added `getjamii.com` to new `jamii-bolt-frontend` project
- [ ] Added `www.getjamii.com` to new project
- [ ] Updated DNS records (if Vercel requires it)
- [ ] Removed domain from old Vercel project
- [ ] Waited for DNS propagation
- [ ] Verified new BOLT UI loads on getjamii.com

## ⚠️ Important Notes

- **DNS propagation can take time** - Usually 5-60 minutes, sometimes up to 48 hours
- **Both projects can't have the same domain** - Remove from old project first
- **Vercel will provide SSL automatically** - No need to configure certificates
- **The new BOLT frontend is ready** - Just needs the domain pointed to it

---

**Once DNS propagates, getjamii.com will show the new BOLT UI!** 🚀

