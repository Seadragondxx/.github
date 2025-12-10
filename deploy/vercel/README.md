# Vercel Deployment

## Quick Start

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository at [vercel.com/new](https://vercel.com/new)
3. Configure environment variables in the Vercel dashboard

## Environment Variables

Set these in your Vercel project settings:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Your database connection string |
| `AUTH_SECRET` | Secret for NextAuth.js (generate with `openssl rand -base64 32`) |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |

## Configuration

The `vercel.json` file includes:

- **buildCommand**: Runs `prisma generate` before `next build`
- **functions**: API routes have a 30-second max duration
- **regions**: Defaults to `iad1` (US East) - modify as needed

## Notes

- Prisma generates the client during `postinstall` and build
- For serverless databases, consider using Vercel Postgres or PlanetScale
- Edge functions are supported for compatible routes
