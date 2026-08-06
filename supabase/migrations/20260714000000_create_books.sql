create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Anyone can read books"
  on public.books
  for select
  using (true);

create policy "Anyone can insert books"
  on public.books
  for insert
  with check (true);

grant select, insert on public.books to anon, authenticated;
