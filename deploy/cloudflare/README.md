# Cloudflare Pages Deployment

Deploy your Next.js app to Cloudflare Pages using `@cloudflare/next-on-pages`.

## Prerequisites

```bash
npm install -D @cloudflare/next-on-pages
```

## Setup

### 1. Update `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Cloudflare Pages
  output: 'standalone',
};

module.exports = nextConfig;
```

### 2. Add Build Script

In `package.json`:

```json
{
  "scripts": {
    "pages:build": "npx @cloudflare/next-on-pages",
    "pages:preview": "npx wrangler pages dev",
    "pages:deploy": "npx wrangler pages deploy"
  }
}
```

### 3. Configure wrangler.json

Copy `wrangler.json` to your project root and update the `name` field.

## Deployment

### Via Cloudflare Dashboard

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/?to=/:account/pages)
2. Create a new project → Connect to Git
3. Set build configuration:
   - **Build command**: `npm run pages:build`
   - **Build output directory**: `.vercel/output/static`
4. Add environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`

### Via CLI

```bash
# Build
npm run pages:build

# Deploy
npx wrangler pages deploy .vercel/output/static
```

## Environment Variables

Set these in your Cloudflare Pages project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string (use a serverless DB like Neon) |
| `AUTH_SECRET` | NextAuth.js secret |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |

## Important Notes

- Cloudflare Pages runs on the Edge runtime
- Use serverless databases (Neon, PlanetScale, Turso) for best compatibility
- Some Node.js APIs may not be available in the Edge runtime
- Prisma requires `@prisma/adapter-neon` for edge compatibility

## Edge-Compatible Prisma Setup

```bash
npm install @prisma/adapter-neon @neondatabase/serverless
```

Update your Prisma client initialization for edge compatibility.

## Resources

- [@cloudflare/next-on-pages docs](https://github.com/cloudflare/next-on-pages)
- [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
