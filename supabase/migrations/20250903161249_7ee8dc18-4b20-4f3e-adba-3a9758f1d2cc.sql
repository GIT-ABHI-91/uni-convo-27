-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Profiles (linked to auth.users)
create table if not exists public.users (
  id uuid primary key,                              -- equals auth.users.id
  name text not null,
  email text unique not null,
  role text not null check (role in ('Student','Faculty','Alumni')),
  created_at timestamp with time zone default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  receiver_id uuid not null references public.users(id) on delete cascade,
  content text not null,
  timestamp timestamp with time zone default now(),
  status text not null check (status in ('sent','delivered','seen'))
);

-- Presence (optional if you prefer DB-based presence)
create table if not exists public.user_status (
  user_id uuid primary key references public.users(id) on delete cascade,
  status text not null check (status in ('online','away','offline')),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_messages_pair_time on public.messages (sender_id, receiver_id, timestamp);
create index if not exists idx_messages_receiver_time on public.messages (receiver_id, timestamp);

-- Row Level Security
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.user_status enable row level security;

-- Users policies
create policy "users_select_all" on public.users
for select to authenticated using (true);

create policy "users_insert_self" on public.users
for insert to authenticated with check (id = auth.uid());

create policy "users_update_self" on public.users
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Messages policies
create policy "messages_insert_sender_only" on public.messages
for insert to authenticated with check (sender_id = auth.uid());

create policy "messages_select_participants" on public.messages
for select to authenticated using (sender_id = auth.uid() or receiver_id = auth.uid());

create policy "messages_update_sender_delivered" on public.messages
for update to authenticated using (sender_id = auth.uid())
with check (status in ('sent','delivered','seen'));

create policy "messages_update_receiver_seen" on public.messages
for update to authenticated using (receiver_id = auth.uid())
with check (status in ('sent','delivered','seen'));

-- Presence policies
create policy "user_status_upsert_self" on public.user_status
for insert to authenticated with check (user_id = auth.uid());

create policy "user_status_update_self" on public.user_status
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "user_status_select_all" on public.user_status
for select to authenticated using (true);

-- Function to create user profile after signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id, 
    new.raw_user_meta_data ->> 'name',
    new.email,
    new.raw_user_meta_data ->> 'role'
  );
  return new;
end;
$$;

-- Trigger to automatically create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();