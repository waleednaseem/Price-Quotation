create table if not exists schema_migrations (
  id serial primary key,
  filename text not null unique,
  applied_at timestamptz not null default now()
);

create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('admin','client')),
  password_hash text,
  approved boolean not null default false,
  picture text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quotations (
  id text primary key,
  project_name text not null,
  company_name text not null,
  client_id text references users(id) on delete set null,
  deployment_cost numeric(12,2) not null default 0,
  notes text,
  status text not null check (status in ('draft','sent','accepted','declined','updated')) default 'draft',
  invite_token text,
  invite_email text,
  invited_at timestamptz,
  total_cost numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists features (
  id text primary key,
  quotation_id text not null references quotations(id) on delete cascade,
  title text not null,
  description text,
  price numeric(12,2) not null,
  client_proposed_price numeric(12,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists negotiation_messages (
  id text primary key,
  quotation_id text not null references quotations(id) on delete cascade,
  sender_role text not null check (sender_role in ('admin','client')),
  sender_user_id text references users(id),
  text text not null,
  timestamp timestamptz not null default now()
);

create table if not exists client_actions (
  id text primary key,
  client_id text not null references users(id) on delete cascade,
  type text not null check (type in ('login','view_quotation','remove_feature','request_update','accept','decline')),
  quotation_id text references quotations(id),
  details jsonb,
  timestamp timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_quotations_client on quotations(client_id);
create index if not exists idx_features_quotation on features(quotation_id);
create index if not exists idx_messages_quotation on negotiation_messages(quotation_id);
create index if not exists idx_actions_client on client_actions(client_id);