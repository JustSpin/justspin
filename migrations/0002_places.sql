create table if not exists profiles (
  user_id text primary key,
  is_pro boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists saved_places (
  id serial primary key,
  user_id text not null,
  place_id text not null,
  name text not null,
  city text not null default '',
  address text,
  cuisine text,
  lat double precision,
  lon double precision,
  website text,
  phone text,
  starred boolean not null default false,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create index if not exists saved_places_user_id_idx on saved_places (user_id);
create index if not exists saved_places_starred_idx on saved_places (user_id, starred);
