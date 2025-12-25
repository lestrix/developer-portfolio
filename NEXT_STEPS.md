# Next Steps Guide

Welcome to your new Developer Portfolio! Here's your guide to getting it up and running.

## ✅ What's Been Created

Your professional portfolio is ready with:

- ✅ Modern React frontend with gradient design
- ✅ Serverless AWS backend (Lambda + DynamoDB)
- ✅ Full CRUD API for managing projects
- ✅ Professional styling and responsive design
- ✅ Complete documentation (README, WORK_PLAN, DEVELOPER_DIARY)
- ✅ Git repository initialized with main branch
- ✅ GitHub Actions workflows (ready to use)

## 🚀 Step 1: Install Dependencies

```bash
cd /Users/kong/git/developer-portfolio
pnpm install
```

This will install all dependencies for the monorepo.

## 🧪 Step 2: Test Locally (Optional)

### Start the Frontend Only

```bash
cd apps/frontend
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) - you'll see the frontend (no data yet).

### Start Backend + Frontend Together

**Terminal 1 - Backend:**
```bash
cd infra
pnpm sst dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

The backend will start a local development environment with DynamoDB.

## 📦 Step 3: Create GitHub Repository

### Option A: Using GitHub CLI (Recommended)

```bash
cd /Users/kong/git/developer-portfolio

# Create public repository
gh repo create developer-portfolio --public --source=. --remote=origin --push

# Or create private repository
gh repo create developer-portfolio --private --source=. --remote=origin --push
```

### Option B: Using GitHub Website

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `developer-portfolio`
3. Description: "Professional portfolio showcasing 15+ years of development experience"
4. Choose Public or Private
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

Then connect your local repo:

```bash
cd /Users/kong/git/developer-portfolio
git remote add origin https://github.com/YOUR_USERNAME/developer-portfolio.git
git push -u origin main
```

## ☁️ Step 4: Set Up AWS Credentials

### For GitHub Actions Deployment

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |

### For Local Development/Deployment

```bash
# Option 1: Export environment variables
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key

# Option 2: Use AWS CLI configure
aws configure
```

## 🚢 Step 5: Deploy to AWS

```bash
cd infra
pnpm sst deploy --stage production
```

**What this does:**
- Creates DynamoDB table for projects
- Deploys Lambda function with your API
- Deploys React app to S3 + CloudFront
- Prints URLs for frontend and API

**Expected output:**
```
✓ Complete
   Frontend: https://xxxxx.cloudfront.net
   API: https://xxxxx.lambda-url.eu-central-1.on.aws
```

Save these URLs!

## 📝 Step 6: Add Your First Project

### Option A: Using cURL

```bash
curl -X POST https://YOUR_API_URL/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Developer Portfolio",
    "description": "Professional portfolio website built with React, TypeScript, and AWS",
    "longDescription": "A modern serverless portfolio showcasing 15+ years of software development experience. Built with Effect-TS, SST v3, and deployed on AWS infrastructure.",
    "technologies": ["React", "TypeScript", "AWS Lambda", "DynamoDB", "SST", "Effect-TS"],
    "category": "web-development",
    "status": "completed",
    "startDate": "2025-12-25T00:00:00.000Z",
    "githubUrl": "https://github.com/YOUR_USERNAME/developer-portfolio",
    "liveUrl": "https://YOUR_CLOUDFRONT_URL",
    "highlights": [
      "Serverless architecture with AWS Lambda and DynamoDB",
      "Type-safe full-stack with Effect-TS",
      "Modern gradient UI with responsive design",
      "Automated CI/CD with GitHub Actions"
    ],
    "featured": true
  }'
```

### Option B: Using AWS DynamoDB Console

1. Go to AWS Console → DynamoDB
2. Find table: `PortfolioProjects`
3. Click "Explore table items"
4. Click "Create item"
5. Add the fields from the JSON above

## 🔄 Step 7: Enable CI/CD (Automatic)

Once you push to GitHub, the workflows are already configured:

**On every push/PR:**
- ✅ Type checking
- ✅ Linting
- ✅ Tests
- ✅ Build verification

**On push to `main`:**
- ✅ All CI checks
- ✅ Deploy to AWS
- ✅ Update live site

## 🎨 Step 8: Customize Your Portfolio

### Update Personal Information

Edit `apps/frontend/src/App.tsx`:
```typescript
<h1 className="header-title">Your Name's Developer Portfolio</h1>
<p className="header-subtitle">
  Your Title | Your Experience
</p>
```

### Customize Colors

Edit `apps/frontend/src/App.css`:
```css
/* Change gradient colors */
background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
```

### Add More Project Categories

Edit `packages/shared/src/schemas/Project.ts`:
```typescript
category: S.Literal(
  "web-development",
  "backend",
  "your-new-category"  // Add here
)
```

## 📚 Step 9: Add More Projects

Use the same cURL command from Step 6, or build an admin panel.

**Project Ideas:**
- Your most impressive work projects (if shareable)
- Open source contributions
- Side projects
- Learning projects
- This portfolio itself!

## 🎯 Next Phase: Quality & Enhancements

See [WORK_PLAN.md](./WORK_PLAN.md) for the full roadmap.

**Recommended Next Steps:**
1. Configure ESLint/Prettier
2. Write tests
3. Add more project data
4. Optimize images
5. Add analytics
6. Consider adding:
   - Contact form
   - Blog section
   - Dark mode toggle
   - Admin panel for managing projects

## 🐛 Troubleshooting

### TypeScript Errors in IDE

Run `pnpm install` to install all dependencies. The errors should disappear once packages are installed.

### "Cannot find module" errors

```bash
pnpm install
cd apps/backend && pnpm install
cd ../frontend && pnpm install
```

### Deployment fails

1. Check AWS credentials are set
2. Verify you have permissions to create resources
3. Check AWS region is correct (eu-central-1)
4. Review CloudWatch logs for errors

### Frontend shows "No projects found"

1. Verify backend is deployed
2. Check API URL in deployment output
3. Verify DynamoDB table has data
4. Check browser console for errors

## 📞 Need Help?

- Check [README.md](./README.md) for basic info
- Review [WORK_PLAN.md](./WORK_PLAN.md) for project phases
- Read [DEVELOPER_DIARY.md](./DEVELOPER_DIARY.md) for insights
- Check GitHub Actions logs for CI/CD issues
- Review CloudWatch logs for backend errors

## 🎉 You're Ready!

Your portfolio is set up and ready to showcase your work. Start adding projects and share it with potential employers!

**Recommended timeline:**
- Day 1: Deploy and add 3-5 featured projects
- Week 1: Add 10+ total projects
- Week 2: Optimize, test, polish
- Ongoing: Keep it updated with new work

Good luck with your job search!

---

**Created:** 2025-12-25
**Project:** Kong's Developer Portfolio
