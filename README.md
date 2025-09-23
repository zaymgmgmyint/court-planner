This is a Next.js 15 + Tailwind CSS app that renders a tennis court schedule UI.

## Getting Started

First, install deps and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The UI is implemented in `src/app/page.tsx` using components in `src/components`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

Notes
- Static mock data lives in `src/lib/mockData.ts` and types in `src/lib/types.ts`.
- Hour rows are 64px tall; events are positioned by time.
- To integrate a public Google Calendar later, fetch events server-side, map them to the `CalendarEvent` type, and pass to the `Schedule` component.
