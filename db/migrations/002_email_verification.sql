alter table users add column if not exists email_verified boolean not null default false;
alter table users add column if not exists verify_token_hash text;
alter table users add column if not exists verify_expires timestamptz;
create index if not exists idx_users_email_verified on users(email_verified);