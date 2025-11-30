# GitHub Setup Guide for Personal Projects

## 1. Create a GitHub Account

1. Go to https://github.com
2. Click "Sign up"
3. Choose a username (e.g., `edisonliwh`)
4. Verify your email address

## 2. Set Up Authentication

### Option A: SSH Keys (Recommended)

SSH keys allow you to push/pull without entering credentials each time.

**Generate SSH Key:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

**Add to SSH Agent:**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Copy Public Key:**
```bash
cat ~/.ssh/id_ed25519.pub
```

**Add to GitHub:**
1. Go to GitHub → Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key
4. Save

**Test Connection:**
```bash
ssh -T git@github.com
```

### Option B: Personal Access Token (PAT)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token (you won't see it again!)
5. Use it as password when pushing/pulling

## 3. Create a New Repository

### Via GitHub Website:

1. Click the "+" icon → "New repository"
2. Repository name: `type-scale-calculator` (or your project name)
3. Description: Brief description of your project
4. Choose visibility:
   - **Public**: Anyone can see (free, unlimited)
   - **Private**: Only you can see (free for personal use)
5. **Don't** initialize with README (if you already have code)
6. Click "Create repository"

### Via Command Line:

```bash
# Create a new repository on GitHub (requires GitHub CLI)
gh repo create type-scale-calculator --public --source=. --remote=origin --push
```

Or manually:
```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin git@github.com:edisonliwh/type-scale-calculator.git

# Push your code
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

## 4. Organize Your Personal Projects

### Repository Naming Conventions:

- Use kebab-case: `my-project-name`
- Be descriptive: `type-scale-calculator` not `project1`
- Include purpose: `portfolio-website`, `todo-app`, `weather-dashboard`

### Repository Structure:

```
username/
├── type-scale-calculator/
├── portfolio/
├── blog/
├── learning-projects/
└── experiments/
```

### Add README.md to Each Project:

```markdown
# Project Name

Brief description of what this project does.

## Features

- Feature 1
- Feature 2

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Live Demo

[Link to deployed version]

## License

MIT
```

## 5. GitHub Profile Setup

Make your GitHub profile stand out:

### Create Profile README:

1. Create a new repository named exactly: `edisonliwh` (your username)
2. Add a `README.md` file
3. GitHub will display it on your profile

**Example Profile README:**
```markdown
# Hi, I'm Edison 👋

I'm a developer passionate about building web applications.

## 🚀 Projects

- [Type Scale Calculator](https://github.com/edisonliwh/type-scale-calculator) - A tool for creating fluid typography scales
- [Portfolio](https://github.com/edisonliwh/portfolio) - My personal website

## 🛠️ Tech Stack

- JavaScript/TypeScript
- React/Next.js
- Node.js

## 📫 Contact

- Email: your.email@example.com
- Twitter: @yourhandle
```

## 6. Best Practices

### Commit Messages:

Use clear, descriptive commit messages:
```bash
git commit -m "Add type scale grouping labels"
git commit -m "Fix contrast ratio for accessibility"
git commit -m "Update dependencies"
```

### Branch Strategy (for personal projects):

- `main`: Production-ready code
- `feature/feature-name`: New features
- `fix/bug-name`: Bug fixes

### .gitignore:

Always include a `.gitignore` file:
```
node_modules/
.next/
.env
.DS_Store
*.log
```

## 7. Useful GitHub Features

### GitHub Actions (CI/CD):

Automate workflows:
- Run tests on every push
- Deploy automatically
- Run linters

### GitHub Pages:

Host static websites for free:
- Go to repository Settings → Pages
- Select branch (usually `main` or `gh-pages`)
- Your site will be at: `username.github.io/repository-name`

### GitHub Discussions:

Enable for community engagement on your projects

### Releases:

Tag important versions:
```bash
git tag -a v1.0.0 -m "First release"
git push origin v1.0.0
```

## 8. Quick Commands Reference

```bash
# Clone a repository
git clone git@github.com:username/repo.git

# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge branch
git merge feature/new-feature
```

## 9. Privacy Settings

- Go to Settings → Privacy
- Choose what's visible:
  - Profile visibility
  - Email visibility
  - Activity visibility

## 10. Useful GitHub Tools

- **GitHub Desktop**: GUI for Git operations
- **GitHub CLI (`gh`)**: Command-line tool
- **GitKraken**: Advanced Git GUI
- **SourceTree**: Free Git GUI

## Next Steps

1. ✅ Set up SSH keys or PAT
2. ✅ Create your first repository
3. ✅ Push your type-scale-calculator project
4. ✅ Create a profile README
5. ✅ Add README.md to your projects
6. ✅ Set up GitHub Actions (optional)
7. ✅ Deploy to Vercel/Netlify

