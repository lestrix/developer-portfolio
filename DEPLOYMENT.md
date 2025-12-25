# Deployment Guide

Complete guide to deploying Kong's Developer Portfolio to AWS.

---

## Quick Start (5 Minutes)

### Prerequisites

- Node.js 20+
- pnpm 9+
- AWS Account
- GitHub account

### 1. Install Dependencies

```bash
cd developer-portfolio
pnpm install
```

### 2. Configure AWS Credentials

```bash
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: eu-central-1
# Default output format: json
```

Verify credentials:
```bash
aws sts get-caller-identity
```

### 3. Deploy to AWS

```bash
cd infra
pnpm sst deploy --stage production
```

**Expected Output:**
```
✓ Complete
   Frontend: https://xxxxx.cloudfront.net
   API: https://xxxxx.lambda-url.eu-central-1.on.aws/
```

Save these URLs!

### 4. Add Your First Project

```bash
curl -X POST https://YOUR_API_URL/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Project",
    "description": "Short description",
    "technologies": ["React", "TypeScript"],
    "category": "web-development",
    "status": "completed",
    "startDate": "2025-01-01T00:00:00.000Z",
    "featured": true,
    "highlights": ["Feature 1", "Feature 2"]
  }'
```

Visit your frontend URL - your project should appear!

---

## Local Development

### Option 1: Frontend Only

```bash
cd apps/frontend
pnpm dev
```

Visit http://localhost:5173 (will show "Failed to fetch" errors without backend)

### Option 2: Full Stack

**Terminal 1 - Backend:**
```bash
cd infra
pnpm sst dev
```

Wait for "Complete" message.

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm dev
```

Visit http://localhost:5173 - full functionality with local DynamoDB.

---

## GitHub Setup & CI/CD

### 1. Create GitHub Repository

**Using GitHub CLI:**
```bash
# Public repository
gh repo create developer-portfolio --public --source=. --remote=origin --push

# Or private repository
gh repo create developer-portfolio --private --source=. --remote=origin --push
```

**Using GitHub Website:**
1. Go to https://github.com/new
2. Name: `developer-portfolio`
3. Choose Public or Private
4. **Don't** initialize with README
5. Click "Create repository"

Then push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/developer-portfolio.git
git push -u origin main
```

### 2. Configure GitHub Secrets

For automated deployments, add AWS credentials to GitHub:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Name | Value |
|------|-------|
| `AWS_ACCESS_KEY_ID` | Your AWS access key |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key |

### 3. Workflows Automatically Run

Once secrets are configured:

**On Pull Request:**
- ✅ Type checking
- ✅ Linting
- ✅ Build verification

**On Push to main:**
- ✅ All CI checks
- ✅ Deploy to AWS
- ✅ Update live site

---

## Multiple Environments

Deploy to different stages:

```bash
# Development
cd infra
pnpm sst deploy --stage dev

# Staging
pnpm sst deploy --stage staging

# Production
pnpm sst deploy --stage production
```

Each stage is completely isolated with separate AWS resources.

---

## Managing Projects

### Add Project

```bash
curl -X POST https://YOUR_API_URL/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Title",
    "description": "Description (max 1000 chars)",
    "longDescription": "Detailed description (optional)",
    "technologies": ["Tech1", "Tech2"],
    "category": "web-development",
    "status": "completed",
    "startDate": "2025-01-01T00:00:00.000Z",
    "endDate": "2025-06-01T00:00:00.000Z",
    "githubUrl": "https://github.com/user/repo",
    "liveUrl": "https://example.com",
    "imageUrl": "https://example.com/image.png",
    "highlights": ["Achievement 1", "Achievement 2"],
    "featured": true
  }'
```

**Categories:** `web-development`, `backend`, `infrastructure`, `data-science`, `mobile`, `iot`, `other`

**Status:** `completed`, `in-progress`, `archived`

### Update Project

```bash
curl -X PATCH https://YOUR_API_URL/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "status": "archived",
    "featured": false
  }'
```

### Delete Project

```bash
curl -X DELETE https://YOUR_API_URL/projects/PROJECT_ID
```

### List Projects

```bash
# All projects
curl https://YOUR_API_URL/projects

# Featured only
curl https://YOUR_API_URL/projects?featured=true

# By category
curl https://YOUR_API_URL/projects?category=backend
```

---

## Troubleshooting

### "Command 'sst' not found"

**Solution:**
```bash
cd developer-portfolio
pnpm install
```

### Frontend Shows "Failed to fetch"

**Check if backend is deployed:**
```bash
cd infra
pnpm sst deploy --stage production
```

**For local development:**
1. Terminal 1: `cd infra && pnpm sst dev`
2. Wait for "Complete"
3. Terminal 2: `cd apps/frontend && pnpm dev`

### TypeScript Errors in IDE

**Solution:**
```bash
cd developer-portfolio
pnpm install
pnpm build
```

Restart your IDE.

### "Cannot find module '@portfolio/shared'"

**Solution:**
```bash
cd packages/shared
pnpm build
```

### AWS Deployment Fails

**Check credentials:**
```bash
aws sts get-caller-identity
```

**Re-configure if needed:**
```bash
aws configure
```

### GitHub Actions Failing

**Check secrets are configured:**
1. Go to repository Settings → Secrets
2. Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` exist
3. Secrets should not be visible (only names shown)

**View detailed logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Click on failed job
4. Expand steps to see error details

### Changes Not Showing on Live Site

**CloudFront cache takes 5-10 minutes to update.**

**To force update:**
```bash
# Find distribution ID
aws cloudfront list-distributions | grep DomainName

# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

**Or redeploy:**
```bash
cd infra
pnpm sst deploy --stage production
```

### DynamoDB Table Not Found

**Deploy infrastructure first:**
```bash
cd infra
pnpm sst deploy --stage production
```

**Verify in AWS Console:**
1. Open AWS Console → DynamoDB
2. Check for table: `PortfolioProjects`

---

## Cleanup

### Remove Deployment

```bash
cd infra
pnpm sst remove --stage production
```

**Warning:** This deletes:
- Lambda function
- DynamoDB table (and all data)
- S3 bucket
- CloudFront distribution
- All associated resources

---

## Cost Estimates

**AWS Free Tier (first 12 months):**
- Lambda: 1M requests/month free
- DynamoDB: 25GB storage + 200M requests free
- CloudFront: 50GB transfer free
- **Estimated cost:** $0/month

**After Free Tier:**
- **Light usage** (< 10k requests/month): ~$1-2/month
- **Medium usage** (< 100k requests/month): ~$5-10/month
- DynamoDB: On-demand pricing (pay per request)
- Lambda: $0.20 per 1M requests
- CloudFront: $0.085 per GB (first 10TB)

---

## Security Best Practices

### AWS Credentials

**Never commit credentials to git:**
- Use environment variables
- Use AWS IAM roles in production
- Rotate access keys regularly

**For GitHub Actions:**
- Use repository secrets (never hardcode)
- Consider using OIDC instead of access keys
- Limit IAM permissions to minimum required

### API Security

Current setup:
- ✅ CORS configured for frontend
- ✅ HTTPS only (Lambda Function URL)
- ❌ No authentication (public API)

**To add authentication (future):**
- Add API Gateway with API keys
- Implement JWT authentication
- Add request rate limiting

---

## Next Steps

1. **Add more projects** - Use the curl commands above
2. **Customize design** - Edit `apps/frontend/src/App.css`
3. **Add images** - Upload to S3 and use URLs in `imageUrl` field
4. **Custom domain** - Configure Route53 and ACM certificate
5. **Analytics** - Add Google Analytics or Plausible
6. **Contact form** - Add email integration with SES

---

## Resources

- [SST Documentation](https://docs.sst.dev/)
- [Effect-TS Documentation](https://effect.website/docs/introduction)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)

---

**Need help?** Check the [README](./README.md) for more details or open an issue on GitHub.
