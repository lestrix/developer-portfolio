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

### Key Features

- 🎨 **Modern UI** - Professional gradient design with responsive layout
- 🚀 **Serverless** - AWS Lambda + DynamoDB for scalability
- 🔒 **Type-Safe** - End-to-end TypeScript with Effect-TS
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- ⚡ **Fast** - CloudFront CDN with optimized bundle

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- AWS Account with CLI configured

### Installation & Local Development

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/developer-portfolio.git
cd developer-portfolio
pnpm install

# Terminal 1: Backend (SST dev mode)
cd infra && pnpm sst dev

# Terminal 2: Frontend (Vite dev server)  
cd apps/frontend && pnpm dev
```

Visit [http://localhost:5173](http://localhost:5173)

### Deploy to AWS

```bash
cd infra
pnpm sst deploy --stage production
```

---

## 🏗️ Architecture

```
CloudFront CDN
├──▶ S3 Static Site (React SPA)
└──▶ Lambda Function URL
     ├──▶ DynamoDB (PortfolioProjects)
     └──▶ CloudWatch Logs
```

**Tech Stack:**
- Frontend: React 18, TypeScript, Vite
- Backend: AWS Lambda (Node.js 20), DynamoDB
- Infrastructure: SST v3, CloudFront
- Shared: Effect-TS, Effect Schema

**Region:** EU Central 1 (Frankfurt)

---

## 📁 Project Structure

```
developer-portfolio/
├── apps/
│   ├── backend/           # Lambda API (CRUD for projects)
│   └── frontend/          # React SPA
├── packages/
│   └── shared/            # Shared types & schemas
├── infra/                 # SST configuration
├── WORK_PLAN.md          # Detailed roadmap
├── DEVELOPER_DIARY.md    # Development log
└── README.md             # This file
```

---

## 🔌 API Endpoints

**Base URL:** `https://<function-url>.lambda-url.eu-central-1.on.aws`

- `GET /health` - Health check
- `GET /projects` - List all projects
- `GET /projects?featured=true` - Filter featured
- `GET /projects?category=web-development` - Filter by category
- `GET /projects/:id` - Get single project
- `POST /projects` - Create project
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

---

## 🧪 Development Commands

```bash
# Root
pnpm install       # Install dependencies
pnpm build         # Build all packages
pnpm test          # Run tests
pnpm lint          # Lint code
pnpm typecheck     # Type check

# Frontend
cd apps/frontend
pnpm dev           # Start dev server
pnpm build         # Production build

# Infrastructure
cd infra
pnpm sst dev       # Local development
pnpm sst deploy    # Deploy to AWS
pnpm sst remove    # Remove from AWS
```

---

## 📖 Documentation

- **[WORK_PLAN.md](./WORK_PLAN.md)** - Project phases and roadmap
- **[DEVELOPER_DIARY.md](./DEVELOPER_DIARY.md)** - Development journey

---

## 👤 About

**Kong**
- 🎓 Physicist, University of Dortmund
- 💼 Software Developer with 15+ years experience
- 🔧 Full-stack development, Cloud architecture, DevOps

---

## 📄 License

MIT License - feel free to use as a template!

---

**Status:** ✅ Core complete | 🔄 CI/CD in progress  
**Last Updated:** December 25, 2025
