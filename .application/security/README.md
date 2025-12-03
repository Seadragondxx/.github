# Security Configuration

## Overview

This directory contains security configurations for headers, CSP, CORS, and other security-related settings. **Security is the highest priority** - implement all recommended headers.

## Files

| File | Purpose |
|------|---------|
| `headers.json` | All security headers with explanations |
| `csp-policies.json` | Content Security Policy for dev/staging/prod |
| `cors-config.json` | CORS settings for different environments |

## Implementation

### Next.js (next.config.js)

```javascript
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self';" },
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

### Nginx

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self';" always;
```

### Cloudflare (Transform Rules)

Use Cloudflare's Modify Response Headers feature or Workers:

```javascript
// Cloudflare Worker
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newResponse = new Response(response.body, response);

  newResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');

  return newResponse;
}
```

## Security Checklist

### Transport Security
- [ ] HTTPS enforced (HSTS header)
- [ ] TLS 1.2+ only
- [ ] Strong cipher suites
- [ ] Certificate valid and not expiring soon

### Content Security
- [ ] CSP header configured
- [ ] No inline scripts without nonce/hash
- [ ] No `unsafe-eval` in production
- [ ] Frame embedding disabled

### Cookie Security
- [ ] `Secure` flag on all cookies
- [ ] `HttpOnly` for session cookies
- [ ] `SameSite=Strict` or `Lax`
- [ ] Short expiration times

### API Security
- [ ] CORS properly configured
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints

### Authentication
- [ ] Strong password requirements
- [ ] Account lockout after failed attempts
- [ ] MFA available/required
- [ ] Secure session management

### Data Protection
- [ ] Sensitive data encrypted at rest
- [ ] PII minimized and protected
- [ ] Secure key management
- [ ] Regular backups encrypted

## Testing Security Headers

### Online Tools
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Command Line
```bash
# Check headers
curl -I https://example.com

# Check specific header
curl -sI https://example.com | grep -i "content-security-policy"

# Full security audit
npx is-website-vulnerable https://example.com
```

### Browser DevTools
1. Open Network tab
2. Reload page
3. Click on document request
4. Check Response Headers

## CSP Violation Reporting

Set up a CSP report endpoint:

```typescript
// app/api/csp-report/route.ts
export async function POST(request: Request) {
  const report = await request.json();

  // Log to monitoring service
  console.log('CSP Violation:', report);

  // Send to logging service (Sentry, LogRocket, etc.)
  // await logService.captureCSPViolation(report);

  return new Response(null, { status: 204 });
}
```

Add to CSP header:
```
Content-Security-Policy: ...; report-uri /api/csp-report; report-to csp-endpoint
```

## OWASP Top 10 Considerations

1. **Injection** - Parameterized queries, input validation
2. **Broken Auth** - Secure session management, MFA
3. **Sensitive Data** - Encryption, minimal collection
4. **XXE** - Disable external entities in XML parsers
5. **Broken Access Control** - RBAC, principle of least privilege
6. **Security Misconfiguration** - Hardened defaults, remove debug
7. **XSS** - CSP, output encoding, sanitization
8. **Insecure Deserialization** - Validate and sign serialized data
9. **Vulnerable Components** - Regular updates, SCA scanning
10. **Insufficient Logging** - Comprehensive audit logs

## Resources

- [OWASP Secure Headers](https://owasp.org/www-project-secure-headers/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Content Security Policy](https://content-security-policy.com/)
