create table if not exists payments (
  id serial primary key,
  user_id text not null,
  kind text not null,
  amount_cents integer not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on payments (user_id);
create index if not exists payments_kind_idx on payments (user_id, kind);
