# Connecting Personal GitHub Account to Vercel

## Problem
When connecting GitHub to Vercel, it's asking to connect with your organization (Tempo) instead of your personal account.

## Solution: Use Personal GitHub Account

### Option 1: Sign Out and Re-authenticate (Recommended)

1. **Sign out of Vercel completely:**
   - Click your profile icon (top right)
   - Click "Sign Out"
   - Make sure you're completely logged out

2. **Clear browser session for GitHub:**
   - Go to GitHub.com
   - Sign out if you're signed in
   - Or use an incognito/private window

3. **Sign in to Vercel with personal account:**
   - Go to vercel.com
   - Click "Sign Up" or "Log In"
   - Choose "Continue with GitHub"
   - **Important**: When GitHub asks which account, select your **personal account** (edisonliwh), NOT the Tempo organization

4. **Authorize Vercel:**
   - Make sure you're authorizing as your personal account
   - Review the permissions carefully

### Option 2: Use Incognito/Private Window

1. Open an incognito/private browser window
2. Go to vercel.com
3. Sign in with GitHub
4. When prompted, select your **personal GitHub account** (not the organization)
5. Complete the authorization

### Option 3: Check GitHub OAuth Settings

1. Go to GitHub.com → Settings → Applications → Authorized OAuth Apps
2. Find "Vercel" in the list
3. Check which account it's authorized for
4. If it's for the organization, revoke it
5. Re-authorize with your personal account

## Important Considerations

### Personal Account vs Organization Account

**Use Personal Account if:**
- ✅ This is your personal project
- ✅ You want full control
- ✅ You don't need organization features
- ✅ You're not sharing with team members

**Use Organization Account if:**
- ✅ You want to share with team members
- ✅ You need organization billing
- ✅ The project is part of company work

### For Your Type Scale Calculator Project

Since this is a **personal project**, you should:
1. ✅ Use your **personal GitHub account** (edisonliwh)
2. ✅ Connect it to your personal Vercel account
3. ✅ Keep it separate from organization projects

## Step-by-Step: Connect Personal Account

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard

2. **Add New Project**
   - Click "Add New..." → "Project"

3. **Import Git Repository**
   - Click "Import Git Repository"
   - If you see organization repos, look for a way to switch accounts
   - Or click "Configure GitHub App" or "Change GitHub Account"

4. **Switch to Personal Account**
   - Look for account switcher (usually top right or in settings)
   - Select your personal account
   - Re-authorize if needed

5. **Select Your Repository**
   - You should now see: `edisonliwh/type-scale-calculator`
   - Select it and proceed with deployment

## Alternative: Manual Repository Connection

If the above doesn't work:

1. **Get your repository URL:**
   ```
   git@github.com:edisonliwh/type-scale-calculator.git
   ```

2. **In Vercel:**
   - Click "Add New..." → "Project"
   - Paste the repository URL
   - Vercel will prompt you to connect the repository
   - Make sure you're connecting as your personal account

## Troubleshooting

### If you're stuck with organization access:

1. **Revoke Vercel access in GitHub:**
   - GitHub → Settings → Applications → Authorized OAuth Apps
   - Find "Vercel" → Revoke

2. **Start fresh:**
   - Sign out of Vercel
   - Clear browser cache/cookies for vercel.com
   - Sign in again with personal account

### Check which account you're using:

- In Vercel dashboard, check the top right corner
- Your profile should show your personal username, not organization name
- If it shows organization, click it and switch accounts

## After Connecting Personal Account

Once connected correctly:
- ✅ You'll see your personal repositories
- ✅ `edisonliwh/type-scale-calculator` will be available
- ✅ Deployments will be under your personal account
- ✅ You have full control

## Security Note

**You can have both:**
- Personal Vercel account (for personal projects)
- Organization Vercel account (for work projects)

They can coexist, but make sure you're using the right one for each project.

