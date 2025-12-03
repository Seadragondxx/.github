# Render Deployment

## Quick Start

### Option 1: Blueprint (Recommended)

1. Copy `render.yaml` to your project root
2. Copy `Dockerfile` from `deploy/docker/` to project root
3. Push to Git
4. Go to [Render Dashboard](https://dashboard.render.com/)
5. New → Blueprint → Connect your repo
6. Render auto-detects `render.yaml` and creates services

### Option 2: Manual Setup

1. New → Web Service
2. Connect your Git repository
3. Select "Docker" as runtime
4. Configure environment variables
5. Deploy

## Environment Variables

Set in Render Dashboard → Environment:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Auto-generated or set manually |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |

## Database

The blueprint includes a PostgreSQL database. After deployment:

1. Go to your database service
2. Copy the "Internal Database URL"
3. Set it as `DATABASE_URL` in your web service

## Plans

| Plan | Price | Resources |
|------|-------|-----------|
| Starter | Free | 512MB RAM, 0.1 CPU |
| Standard | $7/mo | 512MB RAM, 0.5 CPU |
| Pro | $25/mo | 2GB RAM, 1 CPU |

## Custom Domains

1. Go to your web service → Settings → Custom Domains
2. Add your domain
3. Update DNS records as instructed

## Resources

- [Render Blueprints](https://render.com/docs/blueprint-spec)
- [Render Docker](https://render.com/docs/docker)
