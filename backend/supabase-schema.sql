create table if not exists public.olympiad_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text,
  source text not null default 'westbridge-olympiads-website'
);

alter table public.olympiad_leads enable row level security;

create policy "Service role can manage olympiad leads"
  on public.olympiad_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists olympiad_leads_created_at_idx
  on public.olympiad_leads (created_at desc);

create index if not exists olympiad_leads_subject_idx
  on public.olympiad_leads (subject);
