# Fly.io Deployment

## Prerequisites

Install the Fly CLI:

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

## Setup

### 1. Copy Configuration

```bash
cp deploy/fly/fly.toml .
cp deploy/docker/Dockerfile .
```

### 2. Update App Name

Edit `fly.toml` and change the `app` name to your unique app name.

### 3. Launch (First Time)

```bash
fly launch --no-deploy
```

### 4. Set Secrets

```bash
fly secrets set DATABASE_URL="your-database-url"
fly secrets set AUTH_SECRET="your-auth-secret"
fly secrets set AUTH_GITHUB_ID="your-github-id"
fly secrets set AUTH_GITHUB_SECRET="your-github-secret"
```

### 5. Deploy

```bash
fly deploy
```

## Configuration Details

| Setting | Value | Description |
|---------|-------|-------------|
| `primary_region` | `iad` | US East (change as needed) |
| `internal_port` | `3000` | Port your app listens on |
| `auto_stop_machines` | `true` | Scale to zero when idle |
| `memory_mb` | `512` | Memory per instance |

## Health Checks

The config includes a health check hitting `/api/health` every 30 seconds.

## Scaling

```bash
# Scale to multiple instances
fly scale count 2

# Scale machine size
fly scale vm shared-cpu-2x
```

## Database Options

- **Fly Postgres**: `fly postgres create`
- **External**: Neon, Supabase, PlanetScale

## Logs

```bash
fly logs
```

## Resources

- [Fly.io Next.js docs](https://fly.io/docs/js/frameworks/nextjs/)
- [Fly.io Postgres](https://fly.io/docs/postgres/)
