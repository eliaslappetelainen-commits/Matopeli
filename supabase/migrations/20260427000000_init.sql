create extension if not exists "pgcrypto";

create type public.user_role as enum ('private_seller', 'business_seller', 'admin');
create type public.listing_status as enum ('draft', 'published', 'sold', 'archived');
create type public.boost_type as enum ('featured', 'highlight', 'bump');
create type public.order_status as enum ('pending', 'paid', 'failed', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'private_seller',
  full_name text,
  phone text,
  city text,
  avatar_url text,
  is_dealer boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  business_name text not null,
  business_id text,
  description text,
  logo_url text,
  website_url text,
  phone text,
  email text,
  city text,
  is_premium boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.car_brands (
  id bigserial primary key,
  name text not null unique,
  slug text not null unique
);

create table public.car_models (
  id bigserial primary key,
  brand_id bigint not null references public.car_brands(id) on delete cascade,
  name text not null,
  slug text not null,
  unique (brand_id, slug)
);

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete set null,
  brand_id bigint references public.car_brands(id) on delete set null,
  model_id bigint references public.car_models(id) on delete set null,
  title text not null,
  description text not null,
  price_eur integer not null check (price_eur >= 0),
  year integer not null check (year >= 1900 and year <= 2100),
  mileage_km integer not null check (mileage_km >= 0),
  fuel_type text not null,
  transmission text not null,
  body_type text not null,
  drivetrain text not null,
  power_hp integer check (power_hp >= 0),
  engine_size_l numeric(4,1),
  color text,
  city text not null,
  condition text not null,
  registration_number text,
  status public.listing_status not null default 'draft',
  published_at timestamptz,
  sold_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  price_eur integer not null check (price_eur >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  listing_id uuid references public.listings(id) on delete set null,
  status public.order_status not null default 'pending',
  total_eur integer not null check (total_eur >= 0),
  provider text,
  provider_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.listing_boosts (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  boost_type public.boost_type not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  reporter_id uuid references public.profiles(id) on delete set null,
  reason text not null,
  details text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_dealer)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'private_seller'),
    coalesce((new.raw_user_meta_data ->> 'role') = 'business_seller', false)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger business_profiles_set_updated_at
before update on public.business_profiles
for each row execute function public.set_updated_at();

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.orders enable row level security;
alter table public.listing_boosts enable row level security;
alter table public.reports enable row level security;

create policy "profiles are readable by everyone"
on public.profiles for select
using (true);

create policy "users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "business profiles are readable by everyone"
on public.business_profiles for select
using (true);

create policy "business owners can manage their profiles"
on public.business_profiles for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "published listings are public"
on public.listings for select
using (
  status = 'published'
  or seller_id = auth.uid()
);

create policy "owners can insert listings"
on public.listings for insert
with check (seller_id = auth.uid());

create policy "owners can update listings"
on public.listings for update
using (seller_id = auth.uid())
with check (seller_id = auth.uid());

create policy "owners can delete draft listings"
on public.listings for delete
using (seller_id = auth.uid() and status = 'draft');

create policy "listing images are public for published listings"
on public.listing_images for select
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and (
        listings.status = 'published'
        or listings.seller_id = auth.uid()
      )
  )
);

create policy "listing owners can manage images"
on public.listing_images for all
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.listings
    where listings.id = listing_images.listing_id
      and listings.seller_id = auth.uid()
  )
);

create policy "users can read own favorites"
on public.favorites for select
using (user_id = auth.uid());

create policy "users can manage own favorites"
on public.favorites for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "users can read own orders"
on public.orders for select
using (buyer_id = auth.uid());

create policy "users can create own orders"
on public.orders for insert
with check (buyer_id = auth.uid());

create policy "listing boosts are public for published listings"
on public.listing_boosts for select
using (
  exists (
    select 1
    from public.listings
    where listings.id = listing_boosts.listing_id
      and listings.status = 'published'
  )
);

create policy "users can create own reports"
on public.reports for insert
with check (reporter_id = auth.uid() or reporter_id is null);
