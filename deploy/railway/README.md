# Railway Deployment

## Quick Start

### 1. Setup

1. Copy files to project root:
   ```bash
   cp deploy/railway/railway.json .
   cp deploy/docker/Dockerfile .
   ```

2. Push to Git

### 2. Deploy on Railway

1. Go to [Railway](https://railway.app/)
2. New Project → Deploy from GitHub repo
3. Railway auto-detects `railway.json`

### 3. Add PostgreSQL

1. In your project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway auto-links `DATABASE_URL`

### 4. Set Variables

Go to your service → Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Auto-set by Railway Postgres |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |
| `PORT` | Auto-set by Railway |

## Configuration

The `railway.json` specifies:

- **builder**: Uses Dockerfile
- **replicas**: 1 instance (scale in dashboard)
- **healthcheck**: Monitors `/api/health`
- **restart**: Auto-restarts on failure (max 3 retries)

## Railway CLI

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs
```

## Pricing

- **Starter**: $5/mo + usage
- **Pro**: $20/mo + usage (team features)

Usage-based: Pay for CPU, memory, and bandwidth.

## Resources

- [Railway Docs](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
