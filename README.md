# Solder Sisters

A ladies-first hardware build club site. Vite + React, single-component, styled inline (no CSS framework, no build config to fuss with).

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

## Deploy

It's a static Vite site, so any static host works.

**Vercel / Netlify (easiest):**
1. Push this folder to a GitHub repo.
2. Import it in Vercel or Netlify.
3. Framework preset: **Vite** · Build command: `npm run build` · Output dir: `dist`
4. Add your custom domain in their dashboard.

---

## Connect the live Google Doc guides

Visitors enter their email once, then they can open the latest version of each
guide, make their own Google Docs copy, or download it as a PDF. You keep editing
the original Google Doc and visitors always see the latest version.

1. Create each guide in Google Docs.
2. Click **Share** and set **General access** to **Anyone with the link · Viewer**.
   Do not give public edit access.
3. Copy `.env.example` to `.env`.
4. Paste each normal Google Docs Share URL into the matching variable.
5. Restart `npm run dev` after changing `.env`.

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
`meetup-waitlist` as `guide_id` and `Next meetup waitlist` as `guide_title`, so
they are easy to filter separately from guide downloads.

## ⚠️ Before you truly launch — 1 thing is still a placeholder

### The RM 15 fee has no payment
There's no payment attached anywhere. Add a **Stripe Payment Link** (or your preferred MY option) — either on the signup button or sent after someone registers.

---

## Where things are in `src/App.jsx`

- `GUIDES` array (top of file) — edit build titles, blurbs, parts lists here
- `Hero` — headline + intro copy
- `HowItWorks` — the 3 steps
- `Guides` — the build cards + email gate entry
- `Community`, `FAQ` — copy blocks
- `FinalCTA` — the main signup form
- `Chip` / `ChipField` — the hand-drawn microchip motif (the signature graphic)
- `C` object (top) — the two brand colors (blue + cream)
- `S` object (bottom) — all styles

The name **Solder Sisters** and the `hello@soldersisters.club` email are placeholders — swap freely.
