# AWS Amplify Deployment

## Quick Start

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Select the branch to deploy
5. In build settings, select the `amplify.yml` file from `deploy/amplify/`
6. Configure environment variables
7. Deploy

## Environment Variables

Set these in Amplify Console → App settings → Environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string |
| `AUTH_SECRET` | NextAuth.js secret |
| `AUTH_GITHUB_ID` | GitHub OAuth Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth Client Secret |

## Build Specification

The `amplify.yml` includes:

- **preBuild**: Installs dependencies and generates Prisma client
- **build**: Runs Next.js build
- **artifacts**: Outputs the `.next` directory
- **cache**: Caches `node_modules` and `.next/cache` for faster builds

## Notes

- Amplify automatically detects Next.js and enables SSR
- For serverless databases, consider Amazon RDS or external providers
- Ensure your `next.config.js` has `output: 'standalone'` for optimal performance
