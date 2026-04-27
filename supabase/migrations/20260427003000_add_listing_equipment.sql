alter table public.listings
add column if not exists equipment text[] not null default '{}';
