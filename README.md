# Vakeelapp

Vakeelapp is a Next.js application for guided legal intake and source-linked legal research. The landing page previews guided intake and fictional lawyer matching. The workspace searches imported records and lets signed-in users save research.

Use Node.js 24 or later.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3001. The workspace is at /workspace. Existing /index.html and /workspace.html URLs redirect to the new routes.

```sh
npm test
npm run build
npm start
```

Next.js renders the pages from the App Router. Their existing interaction scripts and styles live in public/assets. Next.js serves the JSON API through pages/api, with the same SQLite schema. The database defaults to .runtime/legal-os.sqlite. Set DATABASE_PATH to use a different database. Set COOKIE_SECURE=true for HTTPS.

To import authorized legal records, run `node backend/import.ts /path/to/records.json`. The importer requires source provenance, usage permission, and checksums.
