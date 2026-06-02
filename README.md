# WestBridge Olympiad Academy Hong Kong

Fresh multi-page website for WestBridge Olympiad preparation in Hong Kong.

## Pages

- `index.html` - home and dream/sales page
- `education.html` - course structure, monthly programme, subjects, tutors
- `why-olympiads.html` - admissions signal, Olympiad ladder, fictional success stories
- `results.html` - medal dashboard, ceremony-photo proof section, placeholder stories
- `apply.html` - HK$300 Olympiad Thinking Test application form

## Free deployment stack

- Hosting: Netlify
- Backend: Netlify Functions
- Storage: Supabase

## Supabase setup

1. Create a Supabase project.
2. Run `backend/supabase-schema.sql` in the Supabase SQL editor.
3. Deploy this folder to Netlify.
4. Add Netlify environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Submit the Apply form and confirm a new row in `public.olympiad_test_applications`.

## Content notes

- The tutor cards are placeholders for real photos and bios.
- The success stories are fictional placeholders and should be replaced with verified stories and permissions.
- The university-admissions percentages are illustrative signal estimates, not guarantees or official university data.
- The current logo is loaded from the Young CFO Weekend site:
  `https://www.youngcfoweekend.com/lovable-uploads/69105732-5144-4ab6-b58d-0c80ccc18c07.png`

## Media to replace later

- Hero images
- Tutor photos
- Award ceremony photo wall
- Student success-story photos
- Real medal certificates or press screenshots
