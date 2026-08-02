# Wallflower Project

A small KL community that helps tired, curious adults connect by making things
together. Vite + React, single-page, styled inline.

## Run it locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for production

```bash
npm run build      # outputs static files to /dist
npm run preview    # preview the production build locally
```

## Cyberdeck workshop page

The participant-facing guide lives at `/cyberdeck-workshop`. It covers the
equipment, a seven-step Part 1 setup, Raspberry Pi compatibility, choosing two
included games, Workshop Part 2 signup, troubleshooting, and safe shutdown. The homepage
links to it from both the navigation and the Cyberdeck Part 1 card.

`VITE_CYBERDECK_REPOSITORY_URL` controls the page's source and workshop download
buttons. The participant button points directly to `cyberdeck-workshop.zip` in
the latest GitHub Release rather than the moving `main` branch.

The installation section mirrors the release README: download the ZIP, run the
software checks, choose apps, install, reboot and shut down safely.
Prepare future changes in a branch and Vercel preview; merge and promote them only
after the site owner approves the preview.

## Deploy

It's a static Vite site, so any static host works.

**Vercel:**
1. Push this folder to a GitHub repo.
2. Import it in Vercel.
3. Framework preset: **Vite** · Build command: `npm run build` · Output dir: `dist`
4. Add your custom domain in their dashboard.

The current live guide and Supabase publishable client settings have safe public
defaults in `src/config.js`, so they are included in every static deployment.
Hosting environment variables are optional overrides; when you change one, trigger
a new build because Vite reads them at build time.

---

## Connect the live Google Doc guides

Visitors enter their email once, then they can open the latest version of each
guide, make their own Google Docs copy, or download it as a PDF. You keep editing
the original Google Doc and visitors always see the latest version.

1. Create each guide in Google Docs.
2. Click **Share** and set **General access** to **Anyone with the link · Viewer**.
   Do not give public edit access.
3. To replace the current guide, copy `.env.example` to `.env`.
4. Paste each normal Google Docs Share URL into the matching variable.
5. Restart `npm run dev` after changing `.env`; Vite does not reload environment
   variables in a server that is already running.

The app converts each Share URL into safe view, copy, and PDF-download links.

## Collect guide emails

Guide emails are stored in Supabase. Run this once in the Supabase SQL Editor:

```sql
create table public.guide_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  guide_id text not null,
  guide_title text,
  created_at timestamptz not null default now()
);

alter table public.guide_signups enable row level security;
grant insert on public.guide_signups to anon, authenticated;

create policy "Visitors can submit guide signups"
on public.guide_signups
for insert
to anon, authenticated
with check (true);
```

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`. Only the
publishable key belongs in browser code; never use a secret or service-role key.
The insert-only RLS policy lets visitors submit an address without giving them
permission to read the email list. The guide unlocks only after Supabase accepts
the signup, and the browser remembers the unlock for future visits.

The homepage **Save my spot** form also writes to this table. Its rows use
`meetup-waitlist` as `guide_id` and `Wallflower Project meetup waitlist` as `guide_title`, so
they are easy to filter separately from guide downloads.

## Before taking paid reservations

The site describes a small commitment fee but does not collect payment yet. Add a
payment link only after the fee and meetup logistics are final.

---

## Where things are in `src/App.jsx`

- `GUIDES` array (top of file) — edit build titles, blurbs, parts lists here
- `Hero` — headline + intro copy
- `HowItWorks` — the 3 steps
- `WhatWeMake` — the build cards + email gate entry
- `Story`, `Community`, `FAQ` — the core brand and community copy
- `FinalCTA` — the main signup form
- `ConnectionGlyph` — the flower, circuit, and human-connection motif
- `C` object (top) — cobalt, cream, and coral brand colors
- `S` object (bottom) — all styles

The founder intro, social destinations, and `hello@wallflowerproject.my` address are
placeholders until the final profiles and domain are ready.
