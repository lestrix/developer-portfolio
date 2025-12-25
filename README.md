# Kong's Developer Portfolio

> Professional portfolio website showcasing 15+ years of software development expertise

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Effect-TS](https://img.shields.io/badge/Effect--TS-3.x-black)](https://effect.website/)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%7C%20DynamoDB-orange)](https://aws.amazon.com/)
[![SST](https://img.shields.io/badge/SST-v3-blueviolet)](https://sst.dev/)

---

## 📋 About

Professional portfolio website for **Kong** - Physicist from the **University of Dortmund** with **15+ years** of software development experience.

This platform showcases development projects, technical skills, and professional journey for job applications and references.

---

## ✨ What Makes This Special

### 🎯 Professional Showcase
Built specifically for job applications and professional references, this portfolio demonstrates:
- **Real-world Experience**: Projects spanning web development, backend systems, infrastructure, and full-stack applications
- **Technical Depth**: Effect-TS functional programming, AWS serverless architecture, type-safe development
- **Best Practices**: CI/CD pipelines, comprehensive testing, clean architecture, detailed documentation

### 🏗️ Modern Architecture
Production-ready serverless infrastructure that scales automatically:
- **Serverless-first**: No servers to manage, automatic scaling, pay-per-use pricing
- **Cloud-native**: Built on AWS Lambda, DynamoDB, CloudFront, and S3
- **Infrastructure as Code**: Complete SST v3 configuration for reproducible deployments
- **Multi-region ready**: EU Central 1 (Frankfurt) with easy region switching

### 🔒 Type Safety End-to-End
Complete type safety across the entire stack:
- **Shared Type Definitions**: Single source of truth in `@portfolio/shared` package
- **Runtime Validation**: Effect Schema for API requests and responses
- **Compile-time Safety**: TypeScript 5.6 with strict mode across all packages
- **No Type Drift**: Frontend and backend share exact same types

### 🎨 Professional User Experience
Clean, modern interface designed for recruiters and hiring managers:
- **Gradient Design**: Eye-catching purple/violet gradient theme with glassmorphism
- **Responsive Layout**: Optimized for desktop, tablet, and mobile viewing
- **Advanced Filtering**: Category-based filtering, featured projects toggle, status indicators
- **Performance**: CloudFront CDN delivery, optimized bundles, lazy loading

### 🛠️ Developer Experience
Built for maintainability and future enhancements:
- **Monorepo Structure**: pnpm workspaces with shared dependencies
- **Hot Reload**: Instant feedback during development with Vite HMR and SST Live Lambda
- **Type-safe API Client**: Auto-generated client with full IntelliSense support
- **Comprehensive Documentation**: Work plan, developer diary, and deployment guides

---

## 🚀 Features

### Backend (Lambda + DynamoDB)
- ✅ RESTful API with Lambda Function URLs
- ✅ Complete CRUD operations for projects
- ✅ Server-side filtering (category, featured status)
- ✅ Automatic sorting by date (newest first)
- ✅ Runtime schema validation with Effect Schema
- ✅ Type-safe error handling with Effect-TS
- ✅ CloudWatch logging and monitoring
- ✅ CORS configuration for cross-origin requests
- ✅ Single-table DynamoDB design
- ✅ Scalable serverless architecture

### Frontend (React + TypeScript)
- ✅ Modern React 18 with TypeScript 5.6
- ✅ Professional gradient UI with glassmorphism effects
- ✅ Category filtering (8 categories supported)
- ✅ Featured projects toggle
- ✅ Status badges (completed, in-progress, archived)
- ✅ Technology tags with visual styling
- ✅ Project cards with hover effects
- ✅ Responsive grid layout
- ✅ Date formatting and metadata display
- ✅ External links (GitHub, Live Demo)
- ✅ Loading states and error handling
- ✅ Empty state messages
- ✅ Vite 6 for fast development and builds
- ✅ Type-safe API client with error handling

### Infrastructure (SST v3)
- ✅ Complete AWS infrastructure as code
- ✅ Lambda Function URL (simpler than API Gateway)
- ✅ DynamoDB table with optimized indexes
- ✅ CloudFront CDN distribution
- ✅ S3 bucket for static site hosting
- ✅ Automatic CORS configuration
- ✅ Environment-based deployments (dev/staging/production)
- ✅ Resource linking between components
- ✅ CloudWatch log groups
- ✅ IAM roles and policies (least privilege)

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [README.md](./README.md) | This file - complete project overview |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | Step-by-step deployment guide for first-time setup |
| [WORK_PLAN.md](./WORK_PLAN.md) | 9-phase project roadmap with detailed tasks |
| [DEVELOPER_DIARY.md](./DEVELOPER_DIARY.md) | Development journey, decisions, and insights |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+ (`npm install -g pnpm`)
- **AWS Account** with CLI configured
- **AWS CLI** installed and configured with credentials
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/developer-portfolio.git
cd developer-portfolio

# Install all dependencies (root + all workspaces)
pnpm install
```

### Local Development

#### Option 1: Frontend Only (No Backend)
Perfect for UI development and styling:

```bash
cd apps/frontend
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) - Frontend will load but show "Failed to fetch" errors.

#### Option 2: Full Stack (Backend + Frontend)
Complete local development environment:

**Terminal 1 - Start Backend:**
```bash
cd infra
pnpm sst dev
```

This starts:
- Local DynamoDB instance
- Lambda function with hot reload
- SST Console at [http://console.sst.dev](http://console.sst.dev)

Wait for "Complete" message, then note the Function URL.

**Terminal 2 - Start Frontend:**
```bash
cd apps/frontend
pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173) - Full portfolio with API integration.

---

## ☁️ Deployment

### First-Time AWS Setup

1. **Configure AWS credentials:**
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: eu-central-1
# Default output format: json
```

2. **Verify credentials:**
```bash
aws sts get-caller-identity
```

### Deploy to Production

```bash
cd infra
pnpm sst deploy --stage production
```

**Expected Output:**
```
✓ Complete
   Frontend: https://d3fkfaizq1kac9.cloudfront.net
   API: https://xxxxx.lambda-url.eu-central-1.on.aws/
```

**What gets deployed:**
- DynamoDB table: `PortfolioProjects`
- Lambda function with Function URL
- S3 bucket with React app build
- CloudFront distribution for CDN
- IAM roles and policies
- CloudWatch log groups

**Cost Estimate:**
- **AWS Free Tier**: ~$0/month (1M Lambda requests, 25GB DynamoDB, 50GB CloudFront)
- **Light Usage**: ~$1-5/month (after free tier)
- **DynamoDB**: On-demand pricing (pay per request)
- **Lambda**: $0.20 per 1M requests
- **CloudFront**: $0.085 per GB (first 10TB)

### Deploy to Other Stages

```bash
# Development
pnpm sst deploy --stage dev

# Staging
pnpm sst deploy --stage staging

# Production
pnpm sst deploy --stage production
```

Each stage is completely isolated with separate AWS resources.

### Remove Deployment

```bash
cd infra
pnpm sst remove --stage production
```

This deletes all AWS resources (Lambda, DynamoDB, S3, CloudFront). **Warning**: This will delete all project data in DynamoDB.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CloudFront CDN                        │
│                  (Global Edge Locations)                     │
└────────────────┬──────────────────────────┬─────────────────┘
                 │                          │
                 │ Static Assets            │ API Requests
                 │                          │
        ┌────────▼────────┐        ┌────────▼─────────┐
        │   S3 Bucket     │        │  Lambda Function │
        │  (React Build)  │        │   (Node.js 20)   │
        │                 │        │                  │
        │  - index.html   │        │  - CRUD API      │
        │  - JS bundles   │        │  - Validation    │
        │  - CSS/Assets   │        │  - Logging       │
        └─────────────────┘        └────────┬─────────┘
                                            │
                                   ┌────────▼──────────┐
                                   │    DynamoDB       │
                                   │ (PortfolioProjects)│
                                   │                   │
                                   │  - id (hash key)  │
                                   │  - Project data   │
                                   └───────────────────┘
                                            │
                                   ┌────────▼──────────┐
                                   │  CloudWatch Logs  │
                                   │                   │
                                   │  - API logs       │
                                   │  - Error tracking │
                                   └───────────────────┘
```

### Tech Stack

**Frontend:**
- React 18.3 - UI framework with hooks
- TypeScript 5.6 - Type safety
- Vite 6 - Build tool and dev server
- Effect-TS 3.x - Functional programming
- CSS3 - Custom styling with gradients

**Backend:**
- AWS Lambda - Serverless compute
- Node.js 20 - Runtime environment
- Effect-TS 3.x - Effect-based architecture
- Effect Schema - Runtime validation

**Infrastructure:**
- SST v3 - Infrastructure as Code
- DynamoDB - NoSQL database
- CloudFront - CDN
- S3 - Static hosting
- IAM - Access management
- CloudWatch - Logging and monitoring

**Development:**
- pnpm - Fast package manager
- Monorepo - Shared workspaces
- TypeScript - Shared types
- ESLint - Code quality
- Prettier - Code formatting

---

## 📁 Project Structure

```
developer-portfolio/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   └── projects-handler.ts    # Lambda CRUD handler
│   │   ├── package.json               # Backend dependencies
│   │   └── tsconfig.json              # Backend TypeScript config
│   │
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   │   └── client.ts          # Type-safe API client
│       │   ├── App.tsx                # Main React component
│       │   ├── App.css                # Gradient styling
│       │   └── main.tsx               # React entry point
│       ├── index.html                 # HTML template
│       ├── package.json               # Frontend dependencies
│       ├── tsconfig.json              # Frontend TypeScript config
│       └── vite.config.ts             # Vite configuration
│
├── packages/
│   └── shared/
│       ├── src/
│       │   ├── schemas/
│       │   │   ├── Project.ts         # Project schema & types
│       │   │   └── Todo.ts            # Legacy Todo schema
│       │   └── index.ts               # Package exports
│       ├── package.json               # Shared package config
│       └── tsconfig.json              # Shared TypeScript config
│
├── infra/
│   ├── sst.config.ts                  # SST infrastructure definition
│   ├── package.json                   # Infrastructure dependencies
│   └── tsconfig.json                  # Infrastructure TypeScript config
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # CI pipeline (test, lint, build)
│       └── deploy.yml                 # CD pipeline (deploy to AWS)
│
├── docs/
│   ├── WORK_PLAN.md                   # 9-phase project roadmap
│   ├── DEVELOPER_DIARY.md             # Development chronicle
│   └── NEXT_STEPS.md                  # Deployment guide
│
├── package.json                       # Root workspace config
├── pnpm-workspace.yaml                # Workspace definition
├── tsconfig.json                      # Root TypeScript config
├── .gitignore                         # Git ignore rules
└── README.md                          # This file
```

---

## 🔌 API Reference

### Base URL
```
Production: https://xxxxx.lambda-url.eu-central-1.on.aws/
Development: http://localhost:3000/
```

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-25T10:30:00.000Z"
}
```

---

#### List All Projects
```http
GET /projects
```

**Query Parameters:**
- `category` (optional) - Filter by category: `web-development`, `backend`, `infrastructure`, `data-science`, `mobile`, `iot`, `other`
- `featured` (optional) - Filter featured projects: `true` or `false`

**Examples:**
```bash
# All projects
curl https://YOUR_API_URL/projects

# Only featured projects
curl https://YOUR_API_URL/projects?featured=true

# Backend projects only
curl https://YOUR_API_URL/projects?category=backend

# Featured web development projects
curl https://YOUR_API_URL/projects?category=web-development&featured=true
```

**Response:**
```json
[
  {
    "id": "proj_abc123",
    "title": "Effect Serverless Todo",
    "description": "Full-stack serverless todo application with Effect-TS",
    "longDescription": "Complete CRUD todo app showcasing Effect-TS...",
    "technologies": ["TypeScript", "Effect-TS", "AWS Lambda", "DynamoDB"],
    "category": "backend",
    "status": "completed",
    "startDate": "2025-12-20T00:00:00.000Z",
    "endDate": "2025-12-25T00:00:00.000Z",
    "githubUrl": "https://github.com/username/effect-serverless-todo",
    "liveUrl": "https://example.cloudfront.net",
    "imageUrl": "https://example.com/screenshot.png",
    "highlights": [
      "Effect-TS functional programming patterns",
      "Type-safe error handling",
      "Serverless architecture"
    ],
    "featured": true,
    "createdAt": "2025-12-25T10:00:00.000Z",
    "updatedAt": "2025-12-25T10:00:00.000Z"
  }
]
```

---

#### Get Single Project
```http
GET /projects/:id
```

**Example:**
```bash
curl https://YOUR_API_URL/projects/proj_abc123
```

**Response:** Same structure as individual project above.

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

---

#### Create Project
```http
POST /projects
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My Awesome Project",
  "description": "Short description (max 1000 chars)",
  "longDescription": "Detailed description (optional, max 5000 chars)",
  "technologies": ["React", "TypeScript", "AWS"],
  "category": "web-development",
  "status": "completed",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-06-01T00:00:00.000Z",
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://project.example.com",
  "imageUrl": "https://example.com/image.png",
  "highlights": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "featured": true
}
```

**Required Fields:**
- `title` (1-200 chars)
- `description` (max 1000 chars)
- `technologies` (array of strings)
- `category` (one of: web-development, backend, infrastructure, data-science, mobile, iot, other)
- `status` (one of: completed, in-progress, archived)
- `startDate` (ISO 8601 string)
- `featured` (boolean)

**Optional Fields:**
- `longDescription`
- `endDate`
- `githubUrl`
- `liveUrl`
- `imageUrl`
- `highlights` (array of strings)

**Example:**
```bash
curl -X POST https://YOUR_API_URL/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Portfolio Website",
    "description": "Professional developer portfolio",
    "technologies": ["React", "AWS", "TypeScript"],
    "category": "web-development",
    "status": "completed",
    "startDate": "2025-12-25T00:00:00.000Z",
    "featured": true,
    "highlights": ["Serverless architecture", "Modern UI"]
  }'
```

**Response:** Created project object with auto-generated `id`, `createdAt`, and `updatedAt`.

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": {
    "title": "Title must be between 1 and 200 characters"
  }
}
```

---

#### Update Project
```http
PATCH /projects/:id
Content-Type: application/json
```

**Request Body:** Any subset of project fields (partial update).

**Example:**
```bash
curl -X PATCH https://YOUR_API_URL/projects/proj_abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "archived",
    "featured": false
  }'
```

**Response:** Updated project object.

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

---

#### Delete Project
```http
DELETE /projects/:id
```

**Example:**
```bash
curl -X DELETE https://YOUR_API_URL/projects/proj_abc123
```

**Response:** 204 No Content

**Error Response (404):**
```json
{
  "error": "Project not found"
}
```

---

## 🧪 Development Commands

### Root (Monorepo)

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm build

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Run tests (when implemented)
pnpm test

# Clean all build artifacts
pnpm clean
```

### Frontend Development

```bash
cd apps/frontend

# Start Vite dev server (http://localhost:5173)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Backend Development

```bash
cd apps/backend

# Type check
pnpm typecheck

# Build
pnpm build

# Lint
pnpm lint
```

### Infrastructure

```bash
cd infra

# Start local development environment
pnpm sst dev

# Deploy to specific stage
pnpm sst deploy --stage dev
pnpm sst deploy --stage staging
pnpm sst deploy --stage production

# View SST console
pnpm sst console

# Remove deployment
pnpm sst remove --stage <stage-name>

# Update SST to latest version
pnpm sst upgrade
```

---

## 🎯 Use Cases

### Perfect For

**Job Applications:**
- Showcase 15+ years of real development experience
- Demonstrate modern technology stack knowledge
- Prove cloud architecture and serverless expertise
- Display full-stack development capabilities

**Professional References:**
- Shareable link for recruiters and hiring managers
- Live demos of actual working projects
- Technical depth visible in project descriptions
- GitHub links for code review

**Portfolio Management:**
- Easy CRUD interface for adding new projects
- Category organization for different skill areas
- Featured projects to highlight best work
- Status tracking (completed, in-progress, archived)

**Learning Platform:**
- Study modern serverless architecture
- Learn Effect-TS functional programming patterns
- Understand SST v3 infrastructure as code
- See type-safe full-stack TypeScript in action

**Template for Others:**
- Clone and customize for your own portfolio
- Well-documented codebase
- Best practices demonstrated
- Production-ready infrastructure

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "Command 'sst' not found"

**Problem:** SST CLI not installed.

**Solution:**
```bash
cd developer-portfolio
pnpm install
```

---

#### 2. Frontend shows "Failed to fetch projects"

**Problem:** Backend not running or CORS issues.

**Solutions:**

**Check if backend is deployed:**
```bash
cd infra
pnpm sst deploy --stage dev
```

**For local development, start backend first:**
```bash
# Terminal 1
cd infra
pnpm sst dev

# Wait for "Complete" message, then Terminal 2
cd apps/frontend
pnpm dev
```

**Check browser console for CORS errors** - Should be resolved automatically by SST Function URL configuration.

---

#### 3. TypeScript errors in IDE

**Problem:** Dependencies not installed or types not generated.

**Solution:**
```bash
cd developer-portfolio
pnpm install
pnpm build
```

Restart your IDE/TypeScript server.

---

#### 4. "Cannot find module '@portfolio/shared'"

**Problem:** Shared package not built or linked.

**Solution:**
```bash
cd packages/shared
pnpm build

# Or from root
pnpm build
```

---

#### 5. Deployment fails with AWS credentials error

**Problem:** AWS CLI not configured.

**Solution:**
```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (eu-central-1), Output (json)

# Verify
aws sts get-caller-identity
```

**For GitHub Actions:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

#### 6. DynamoDB table not found

**Problem:** Resources not deployed or wrong stage.

**Solution:**
```bash
cd infra
pnpm sst deploy --stage production

# Check AWS Console → DynamoDB → Tables
# Look for: PortfolioProjects
```

---

#### 7. "Module not found" during build

**Problem:** Missing dependencies.

**Solution:**
```bash
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm pnpm-lock.yaml

pnpm install
```

---

#### 8. Changes not reflecting in deployed site

**Problem:** CloudFront cache.

**Solutions:**

**Wait 5-10 minutes** for cache to expire.

**Or invalidate CloudFront cache:**
```bash
# Find distribution ID
aws cloudfront list-distributions

# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

**Or force rebuild:**
```bash
cd infra
pnpm sst deploy --stage production
```

---

#### 9. Local DynamoDB connection errors

**Problem:** SST dev mode not running.

**Solution:**
```bash
# Make sure SST dev is running
cd infra
pnpm sst dev

# Leave this running in separate terminal
```

---

#### 10. CORS errors in browser console

**Problem:** Frontend and backend on different origins.

**Solution:**

**Already configured** - SST Function URL handles CORS automatically via `cors: true` in sst.config.ts.

**If issues persist:**
1. Check browser console for exact error
2. Verify API_URL in frontend (apps/frontend/src/App.tsx)
3. Ensure no duplicate CORS headers in Lambda response

---

### Getting Help

**Check logs:**
```bash
# SST Console (when running sst dev)
pnpm sst console

# AWS CloudWatch Logs
aws logs tail /aws/lambda/developer-portfolio-Api --follow

# Or via AWS Console
# CloudWatch → Log groups → /aws/lambda/developer-portfolio-Api
```

**Review documentation:**
- [NEXT_STEPS.md](./NEXT_STEPS.md) - Deployment guide
- [WORK_PLAN.md](./WORK_PLAN.md) - Project roadmap
- [DEVELOPER_DIARY.md](./DEVELOPER_DIARY.md) - Development insights

**External resources:**
- [SST Documentation](https://docs.sst.dev/)
- [Effect-TS Documentation](https://effect.website/docs/introduction)
- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)

---

## 🤝 Contributing

This is a personal portfolio project, but feel free to:

- **Fork** for your own portfolio
- **Report bugs** via GitHub Issues
- **Suggest features** for improvement
- **Submit PRs** for fixes

### Setting Up for Development

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/developer-portfolio.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make changes and test locally
6. Commit with clear messages: `git commit -m "Add: new feature"`
7. Push to your fork: `git push origin feature/your-feature`
8. Open a Pull Request

---

## 📚 Learning Resources

### Effect-TS
- [Effect Documentation](https://effect.website/docs/introduction)
- [Effect Schema Guide](https://effect.website/docs/schema/introduction)
- [Effect-TS YouTube Channel](https://www.youtube.com/@effect-ts)

### SST v3
- [SST Documentation](https://sst.dev/docs)
- [SST Examples](https://github.com/sst/sst/tree/master/examples)
- [SST Discord Community](https://discord.gg/sst)

### AWS Serverless
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/latest/developerguide/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

## 🎉 Acknowledgments

**Built with:**
- [Effect-TS](https://effect.website/) - Functional TypeScript framework
- [SST](https://sst.dev/) - Serverless infrastructure
- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [AWS](https://aws.amazon.com/) - Cloud infrastructure

**Inspired by:**
- Modern serverless architecture patterns
- Functional programming principles
- Type-safe full-stack development
- Professional portfolio best practices

---

## 👤 About Kong

**Education:**
- 🎓 Physics Degree, University of Dortmund

**Experience:**
- 💼 15+ years of software development
- 🔧 Full-stack development (Frontend, Backend, Infrastructure)
- ☁️ Cloud architecture and DevOps
- 🧪 Effect-TS and functional programming enthusiast

**Tech Stack:**
- Languages: TypeScript, JavaScript, Python, Java
- Frontend: React, Vue, Angular
- Backend: Node.js, AWS Lambda, serverless
- Infrastructure: AWS, SST, Terraform, Docker
- Databases: DynamoDB, PostgreSQL, MongoDB

---

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

```
Copyright (c) 2025 Kong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**Status:** ✅ Core complete | 🔄 CI/CD in progress
**Last Updated:** December 25, 2025
**Version:** 1.0.0

---

**Live Demo:** https://d3fkfaizq1kac9.cloudfront.net
**Repository:** https://github.com/YOUR_USERNAME/developer-portfolio
