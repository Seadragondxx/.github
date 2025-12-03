# Docker Deployment

## Prerequisites

Ensure your `next.config.js` has standalone output:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

module.exports = nextConfig;
```

## Build & Run

```bash
# Copy Dockerfile to project root
cp deploy/docker/Dockerfile .

# Build the image
docker build -t fitgen-app .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e AUTH_SECRET="your-auth-secret" \
  -e AUTH_GITHUB_ID="your-github-id" \
  -e AUTH_GITHUB_SECRET="your-github-secret" \
  fitgen-app
```

## Docker Compose

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_GITHUB_ID=${AUTH_GITHUB_ID}
      - AUTH_GITHUB_SECRET=${AUTH_GITHUB_SECRET}
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=fitgen
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

## Multi-Stage Build

The Dockerfile uses multi-stage builds:

1. **base**: Alpine Node.js with required system deps
2. **deps**: Install npm packages and generate Prisma client
3. **builder**: Build the Next.js application
4. **runner**: Minimal production image

## Notes

- The image runs as non-root user `nextjs` for security
- Prisma client is copied to the final image
- Uses standalone output for minimal image size (~150MB)
- OpenSSL is included for Prisma database connections
