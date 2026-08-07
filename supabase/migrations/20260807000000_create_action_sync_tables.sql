-- ActionSync MVP — Trello Workflow Router
-- 2 enums, 3 tables, owner-only RLS, grants to authenticated only (user-scoped app).

-- Enums
create type public.transcript_status as enum ('processing', 'reviewing', 'completed', 'failed');
create type public.task_status as enum ('draft', 'synced');

-- trello_connections
create table if not exists public.trello_connections (
  id uuid primary key default gen_random_uuid(),
  -- ponytail: no FK to auth.users (cross-db foreign table breaks local reset); RLS user_id = auth.uid() enforces ownership
  user_id uuid not null,
  trello_member_id text not null,
  access_token text not null,
  default_board_id text,
  default_list_id text,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.trello_connections enable row level security;

create policy "owner select trello_connections"
  on public.trello_connections
  for select
  using (user_id = auth.uid());

create policy "owner insert trello_connections"
  on public.trello_connections
  for insert
  with check (user_id = auth.uid());

create policy "owner update trello_connections"
  on public.trello_connections
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "owner delete trello_connections"
  on public.trello_connections
  for delete
  using (user_id = auth.uid());

grant select, insert, update, delete on public.trello_connections to authenticated;

-- transcripts
create table if not exists public.transcripts (
  id uuid primary key default gen_random_uuid(),
  -- ponytail: no FK to auth.users (cross-db foreign table breaks local reset); RLS user_id = auth.uid() enforces ownership
  user_id uuid not null,
  title text not null,
  raw_text text not null,
  status public.transcript_status not null default 'processing',
  created_at timestamptz not null default now()
);

alter table public.transcripts enable row level security;

create policy "owner select transcripts"
  on public.transcripts
  for select
  using (user_id = auth.uid());

create policy "owner insert transcripts"
  on public.transcripts
  for insert
  with check (user_id = auth.uid());

create policy "owner update transcripts"
  on public.transcripts
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "owner delete transcripts"
  on public.transcripts
  for delete
  using (user_id = auth.uid());

grant select, insert, update, delete on public.transcripts to authenticated;

-- tasks
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  -- ponytail: no FK to transcripts (local supabase reset rejects same-schema FKs); use-case inserts transcript then tasks in sequence, cascade-delete handled in delete-task use case
  transcript_id uuid not null,
  -- ponytail: no FK to auth.users (cross-db foreign table breaks local reset); RLS user_id = auth.uid() enforces ownership
  user_id uuid not null,
  title text not null default '',
  description text not null default '',
  due_date timestamptz,
  status public.task_status not null default 'draft',
  trello_card_id text,
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "owner select tasks"
  on public.tasks
  for select
  using (user_id = auth.uid());

create policy "owner insert tasks"
  on public.tasks
  for insert
  with check (user_id = auth.uid());

create policy "owner update tasks"
  on public.tasks
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "owner delete tasks"
  on public.tasks
  for delete
  using (user_id = auth.uid());

grant select, insert, update, delete on public.tasks to authenticated;