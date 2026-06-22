# Security Policy

## Sensitive Data

Do not commit production data, user photos, API keys, certificates, server logs,
backup archives, or local `.env` files.

Runtime data is stored under `DATA_DIR` and is ignored by Git by default.

## Reporting Issues

If you discover a security issue, avoid opening a public issue with exploit
details. Contact the maintainer privately first, then coordinate a fix and
public disclosure if needed.

## Deployment Notes

- Keep secrets in server-side environment variables.
- Prefer HTTPS behind Nginx, CDN, or a WAF in production.
- Keep `DATA_DIR` writable only by the app user.
- Enable regular backups and log rotation.
- Rotate third-party API keys if they are ever exposed.
