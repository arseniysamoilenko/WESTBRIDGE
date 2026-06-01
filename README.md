# WestBridge Olympiad Academy Website

Professional landing website for WestBridge Olympiad preparation services.

## What is included

- Static, deployable front end: `index.html`, `styles.css`, `app.js`
- Cinematic placeholder photography from Pexels, ready to replace with WestBridge ceremony media
- Consultation form with preview-mode local storage fallback
- Netlify Function backend: `functions/submit-lead.js`
- Supabase lead table schema: `backend/supabase-schema.sql`
- Netlify deployment config: `netlify.toml`

## Free-service stack

Use this setup for a production-ready launch with no paid infrastructure at the start:

- Hosting: Netlify free tier
- Lead storage: Supabase free tier
- Media storage later: Supabase Storage or Cloudinary free tier
- Domain/DNS: connect the Olympiad domain inside Netlify

## Deployment steps

1. Create a Supabase project.
2. Run `backend/supabase-schema.sql` in the Supabase SQL editor.
3. Deploy this folder to Netlify.
4. Add these Netlify environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Submit the form once and confirm the row appears in `public.olympiad_leads`.

## Replacing placeholder media

The current background images are remote placeholders. Replace these URLs in `index.html` and `styles.css`:

- Hero background: `.hero-media` in `styles.css`
- Tutor/method image: `.faculty-image` in `styles.css`
- Awards photo wall: `.photo-wall` image URLs in `index.html`

For final production, upload WestBridge-owned photos to Supabase Storage or Cloudinary and use optimized delivery URLs.

## Content still needed

- Verified final medal statistics
- Real tutor names, bios, and credentials
- Success-story approvals and student/parent quotes
- Final phone, email, WhatsApp, and social links
- Official brand colors and logo files
