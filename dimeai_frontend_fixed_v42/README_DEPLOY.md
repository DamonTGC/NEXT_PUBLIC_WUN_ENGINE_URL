# DimeAI Tiles Frontend (Next.js 14)

## Local Development

```bash
npm install
# Point this to your Railway backend
export NEXT_PUBLIC_WUN_ENGINE_URL="http://localhost:8000"
npm run dev
```

Visit http://localhost:3000

## Production (Netlify)

Set environment variable:

- NEXT_PUBLIC_WUN_ENGINE_URL = https://YOUR-WUN-ENGINE-SERVICE.up.railway.app

Build command: `npm run build`
Publish directory: `.next`
