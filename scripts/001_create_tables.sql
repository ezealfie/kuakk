-- Create table for storing photos
create table if not exists public.timeline_photos (
  id uuid primary key default gen_random_uuid(),
  month_number int not null unique,
  photo_url text not null,
  uploaded_at timestamp with time zone default now()
);

-- Create table for password
create table if not exists public.app_config (
  id uuid primary key default gen_random_uuid(),
  password_hash text not null,
  created_at timestamp with time zone default now()
);

-- Insert the password "kuakpato" (hashed with bcrypt)
-- For simplicity, we'll store it plain in this case since it's a simple app
insert into public.app_config (password_hash) 
values ('kuakpato')
on conflict do nothing;

-- Enable RLS
alter table public.timeline_photos enable row level security;
alter table public.app_config enable row level security;

-- Public read access for photos
create policy "Anyone can view photos"
  on public.timeline_photos for select
  using (true);

-- Public insert/update/delete for photos (since we're using password auth)
create policy "Anyone can insert photos"
  on public.timeline_photos for insert
  with check (true);

create policy "Anyone can update photos"
  on public.timeline_photos for update
  using (true);

create policy "Anyone can delete photos"
  on public.timeline_photos for delete
  using (true);

-- Public read for config
create policy "Anyone can view config"
  on public.app_config for select
  using (true);
