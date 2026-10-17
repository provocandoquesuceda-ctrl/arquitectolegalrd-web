-- Private consultation history. Apply only to the intended ArquitectoLegalRD Supabase project.
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null check (char_length(question) between 10 and 8000),
  answer text not null,
  model text not null default 'gpt-4.1-mini',
  created_at timestamptz not null default now()
);

create index if not exists consultations_user_created_at_idx
  on public.consultations (user_id, created_at desc);

alter table public.consultations enable row level security;

revoke all on table public.consultations from anon;
grant select, insert on table public.consultations to authenticated;

drop policy if exists "Users can read their own consultations" on public.consultations;
create policy "Users can read their own consultations"
  on public.consultations for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own consultations" on public.consultations;
create policy "Users can insert their own consultations"
  on public.consultations for insert to authenticated
  with check ((select auth.uid()) = user_id);
