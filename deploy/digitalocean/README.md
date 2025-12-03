# DigitalOcean App Platform Deployment

## Quick Start

### Option 1: App Spec (Recommended)

1. Copy `do-app.yaml` to your project root (rename to `.do/app.yaml`)
2. Copy `Dockerfile` from `deploy/docker/` to project root
3. Update `github.repo` in the app spec
4. Push to Git
5. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
6. Create App → Import from GitHub
7. DigitalOcean detects `.do/app.yaml`

### Option 2: Manual Setup

1. Create App → Select GitHub repo
2. Choose "Dockerfile" as source
3. Configure resources and environment variables
4. Deploy

## Environment Variables

Set in App Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection (use managed DB below) |
| `AUTH_SECRET` | NextAuth.js secret |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |

## Database Connection

If using the included managed database:

1. After deployment, go to your database component
2. Copy the connection string
3. Set it as `DATABASE_URL` in your web service

Or use the `${db.DATABASE_URL}` reference in the app spec.

## Instance Sizes

| Size | vCPU | Memory | Price |
|------|------|--------|-------|
| basic-xxs | 1 | 256MB | $5/mo |
| basic-xs | 1 | 512MB | $10/mo |
| basic-s | 1 | 1GB | $12/mo |
| professional-xs | 1 | 1GB | $12/mo |

## CLI Deployment

```bash
# Install doctl
brew install doctl

# Authenticate
doctl auth init

# Create app from spec
doctl apps create --spec .do/app.yaml

# List apps
doctl apps list

# Get logs
doctl apps logs <app-id>
```

## Resources

- [App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [App Spec Reference](https://docs.digitalocean.com/products/app-platform/reference/app-spec/)
