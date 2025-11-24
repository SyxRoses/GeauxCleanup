# 🚀 Vercel Deployment Guide

## Quick Start (5 Minutes)

### Step 1: Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select **`SyxRoses/GeauxCleanup`** from your repositories
3. Click **"Import"**

### Step 3: Configure Project Settings
Vercel will auto-detect your Vite configuration. You should see:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

✅ These are correct - don't change them!

### Step 4: Add Environment Variables
Click **"Environment Variables"** and add these:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://uvprqnqjervbeznfjwbg.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2cHJxbnFqZXJ2YmV6bmZqd2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTM1NTAsImV4cCI6MjA3OTQ4OTU1MH0.C9i1iMSk4wf4QsGyxnC_mSQqhUFsYtXLneerb0Nx6uY` |
| `GEMINI_API_KEY` | `PLACEHOLDER_API_KEY` |

> **Note**: Make sure to select **"Production"**, **"Preview"**, and **"Development"** for all variables.

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. You'll get a URL like: `https://geaux-cleanup.vercel.app`

---

## 📱 Mobile Testing Instructions

### Share with Testers
Send them the Vercel URL (e.g., `https://geaux-cleanup.vercel.app`)

### Add to Home Screen (App-Like Experience)

**iPhone/iPad (Safari):**
1. Open the URL in Safari
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on their home screen!

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the **Menu** (three dots)
3. Tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on their home screen!

---

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel will automatically:
- Build your latest code
- Deploy it to production
- Update the live URL

You can also create **Preview Deployments** for branches to test changes before merging.

---

## 🛠️ Useful Commands

### Test Build Locally (Before Deploying)
```bash
npm run build
npm run preview
```

This will build and preview your production build locally at `http://localhost:4173`

---

## 📊 Vercel Dashboard Features

- **Deployments**: See all your deployments and their status
- **Analytics**: Track visitor stats (available on free tier!)
- **Logs**: Debug any deployment issues
- **Domains**: Add custom domains (e.g., `yourbusiness.com`)

---

## ⚠️ Important Notes

1. **Supabase Configuration**: Make sure your Supabase project allows requests from your Vercel domain
   - Go to Supabase Dashboard → Settings → API
   - Add your Vercel URL to allowed origins if needed

2. **Environment Variables**: Never commit `.env.local` to GitHub - Vercel handles these securely

3. **Build Errors**: If deployment fails, check the build logs in Vercel dashboard

---

## 🎉 You're Done!

Your app is now live and accessible on any device with internet access. Share the URL with your testers and gather feedback!

**Need help?** Check Vercel's excellent documentation at [vercel.com/docs](https://vercel.com/docs)
