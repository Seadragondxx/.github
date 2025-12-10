# Deployment Guide

Quick reference for deploying to all supported platforms.

## Prerequisites

All platforms require these environment variables:

| Variable | Description | Generate |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | From your DB provider |
| `AUTH_SECRET` | NextAuth.js secret (32+ chars) | `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID | [Create OAuth App](https://github.com/settings/developers) |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret | From OAuth App |

## Platform Quick Start

### Vercel (Recommended)

```bash
# Push to Git, then:
# 1. Import at vercel.com/new
# 2. Add environment variables
# 3. Deploy
```

Config: `deploy/vercel/vercel.json`

---

### Cloudflare Pages

```bash
npm install -D @cloudflare/next-on-pages
npm run pages:build
npx wrangler pages deploy .vercel/output/static
```

Config: `deploy/cloudflare/wrangler.json`
Docs: `deploy/cloudflare/README.md`

---

### Netlify

```bash
# Push to Git with netlify.toml in root
# Or drag & drop to netlify.com
```

Config: `deploy/netlify/netlify.toml`

---

### AWS Amplify

```bash
# 1. Connect repo in Amplify Console
# 2. Select deploy/amplify/amplify.yml
# 3. Add environment variables
```

Config: `deploy/amplify/amplify.yml`

---

### Docker / Cloud Run

```bash
# Copy Dockerfile to project root
cp deploy/docker/Dockerfile .

# Build and run
docker build -t myapp .
docker run -p 3000:3000 -e DATABASE_URL=... myapp
```

Config: `deploy/docker/Dockerfile`

---

### Fly.io

```bash
cp deploy/fly/fly.toml .
cp deploy/docker/Dockerfile .

fly launch --no-deploy
fly secrets set DATABASE_URL="..." AUTH_SECRET="..."
fly deploy
```

Config: `deploy/fly/fly.toml`

---

### Render

```bash
# Copy render.yaml to project root
# Push to Git
# New → Blueprint in Render Dashboard
```

Config: `deploy/render/render.yaml`

---

### Railway

```bash
# Push to Git with railway.json
# Import in Railway Dashboard
# Add PostgreSQL from Railway
```

Config: `deploy/railway/railway.json`

---

### DigitalOcean App Platform

```bash
mkdir -p .do
cp deploy/digitalocean/do-app.yaml .do/app.yaml
# Update github.repo in the spec
# Push and import in DO Apps
```

Config: `deploy/digitalocean/do-app.yaml`

---

## Database Providers

| Provider | Best For | Free Tier |
|----------|----------|-----------|
| [Neon](https://neon.tech) | Serverless, Vercel | Yes |
| [Supabase](https://supabase.com) | Full backend | Yes |
| [PlanetScale](https://planetscale.com) | MySQL, scaling | Yes |
| [Railway](https://railway.app) | Easy Postgres | $5 credit |
| [Render](https://render.com) | Managed Postgres | Yes |

## next.config.js

For Docker-based deployments, ensure standalone output:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
```

## Prisma Notes

- `postinstall` script runs `prisma generate` automatically
- For serverless (Vercel, Cloudflare): consider Prisma Accelerate or Data Proxy
- For containers: Prisma client is bundled in the Docker image

## Troubleshooting

### Prisma Client Not Found

```bash
npx prisma generate
```

### Database Connection Failed

- Check `DATABASE_URL` format
- Ensure database allows connections from your deploy region
- For serverless: use connection pooling (e.g., Neon pooler, PgBouncer)

### Build Fails on Cloudflare

- Ensure `@cloudflare/next-on-pages` is installed
- Check for Node.js-only APIs that aren't Edge-compatible
