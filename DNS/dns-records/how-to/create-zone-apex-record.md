# Create zone apex record

When you add a domain to Cloudflare, you may also need to create or review the DNS record on your zone apex. Zone apex refers to the domain (example.com) or subdomain (blog.example.com) that you are adding to Cloudflare.

Usually, the zone apex record makes your domain accessible by visitors. In this case, the necessary record type (A, AAAA, or CNAME) and its content will depend on the provider that hosts your website or application. If you are using Cloudflare Pages, refer to Custom domains. If you are using other providers, look for their guidance on how to connect domains managed on external DNS services.

## ANAME or ALIAS

ANAME or ALIAS are DNS records used by specific DNS providers. If your previous provider was using ANAME or ALIAS, you can recreate these records on Cloudflare as CNAME records. Cloudflare's CNAME flattening allows you to create CNAME records at your zone apex, removing the need for those other record types.

## Zone apex record

To create a zone apex record, use `@` for the record Name, as in the following example.

| Type | Name | IPv4 address | Proxy status |
|------|------|--------------|--------------|
| A    | @    | 192.0.2.1    | Proxied      |

### Dashboard

**API**

Use the Create DNS Record API endpoint.

For field definitions, refer to the API documentation (visible once you select the record type under the request body specification).

- To point to an IPv4 address, select **A Record**, use your zone apex (`@`) for the field name, and use the IPv4 address for the field content.
- To point to an IPv6 address, select **AAAA Record**, use your zone apex (`@`) for the field name, and use the IPv6 address for the field content.
- To point to a fully qualified domain name (FQDN) (such as `your-site.host.example.com`), select **CNAME Record**, use your zone apex (`@`) for the field name, and use the fully qualified domain name for the field content.

## Domain redirects

Once you create a domain, you may want to route that traffic to other places.

For more guidance, refer to Redirect domain to subdomain or Redirect one domain to another.

## Get free SSL certificates

While DNS is what communicates where your website or application can be reached, SSL/TLS is what enables websites and applications to establish connections in a secure way.

If your domain is not correctly covered by an SSL/TLS certificate, your visitors will find a warning on their browser stating that your website or application is not secure.

Cloudflare offers free, unshared, publicy trusted Universal SSL certificates to all Cloudflare domains.

---

**Last updated:** Aug 20, 2025

### Resources
- API
- New to Cloudflare?

### Directory
- Sponsorships
- Open Source

### Support
- Help Center
- System Status
- Compliance
- GDPR

### Company
- cloudflare.com
- Our team
- Careers

### Tools
- Cloudflare Radar
- Speed Test
- Is BGP Safe Yet?
- RPKI Toolkit
- Certificate Transparency

### Community
- X
- Discord
- YouTube
- GitHub
