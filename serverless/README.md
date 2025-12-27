# Contact Form Backend (Serverless) — Example

This site is static. To send messages to **towu.xiaojun@gmail.com**, deploy a serverless endpoint at:

- `POST /api/contact`

The frontend will call it when the checkbox "Send via serverless email relay" is enabled.

## Option A: Cloudflare Workers + MailChannels (recommended for static sites)

Files: `serverless/cloudflare-worker.js`

### Setup
1. Create a Cloudflare Worker
2. Add a Worker route: `https://YOUR_DOMAIN/api/contact*`
3. (Optional) Put `towu.xiaojun@gmail.com` into the script as the target receiver

### Notes
- MailChannels works on Cloudflare for email relay. You may need to verify domains / set allowed senders depending on your setup.

## Option B: Netlify Functions / Vercel Functions
The same request shape applies; implement the handler and send mail via SendGrid / Mailgun / AWS SES.

## Request JSON schema
```json
{
  "to": "towu.xiaojun@gmail.com",
  "from_name": "Visitor Name",
  "from_email": "visitor@example.com",
  "message": "Hello",
  "page": "https://..."
}
```

## Evidence
On every submission, the site generates an Evidence bundle and stores it in `localStorage` as `rsp_last_evidence`.
Users can click **Export Evidence** to download a JSON artifact containing `message.json`, `outcome.json`, and `execution_context.json`.