create table if not exists public.olympiad_test_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  parent_name text not null,
  email text not null,
  phone text not null,
  student_name text not null,
  grade text not null,
  subject text not null,
  message text,
  test_fee_hkd integer not null default 300,
  source text not null default 'westbridge-olympiad-academy-hk'
);

alter table public.olympiad_test_applications enable row level security;

create policy "Service role can manage olympiad test applications"
  on public.olympiad_test_applications
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create index if not exists olympiad_test_applications_created_at_idx
  on public.olympiad_test_applications (created_at desc);

create index if not exists olympiad_test_applications_subject_idx
  on public.olympiad_test_applications (subject);
