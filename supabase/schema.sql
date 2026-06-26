-- ===========================================================
--  AgentMatch AI -- Supabase schema
-- ============================================================

create extension if not exists "uuid-ossp";

create table if not exists public.agent_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  title text not null default '',
  bio text,
  phone text,
  city text not null default '',
  region text not null default '',
  remote boolean not null default false,
  sectors text[] not null default '{}',
  skills text[] not null default '{}',
  experience integer not null default 0,
  commission text,
  cv_url text,
  photo_url text,
  available boolean not null default true,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.company_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  siret text,
  sector text not null default '',
  size text,
  website text,
  description text,
  logo_url text,
  plan text check (plan in ('STARTER','PRO','BUSINESS')),
  plan_expires timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  unique(user_id)
);

create table if not exists public.missions (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.company_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  sector text not null,
  region text not null,
  remote boolean not null default false,
  mission_type text not null default 'CDI',
  experience integer not null default 0,
  commission text,
  budget text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','PAUSED','CLOSED')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default uuid_generate_v4(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  agent_id uuid not null references public.agent_profiles(id) on delete cascade,
  message text,
  status text not null default 'PENDING' check (status in ('PENDING','VIEWED','ACCEPTED','REJECTED')),
  created_at timestamptz not null default now(),
  unique(mission_id, agent_id)
);

create table if not exists public.matches (
  id uuid primary key default uuid_generate_v4(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  agent_id uuid not null references public.agent_profiles(id) on delete cascade,
  score integer not null,
  breakdown jsonb not null default '{}',
  created_at timestamptz not null default now(),
  unique(mission_id, agent_id)
);

create table if not exists public.email_verifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.agent_profiles enable row level security;
alter table public.company_profiles enable row level security;
alter table public.missions enable row level security;
alter table public.applications enable row level security;
alter table public.matches enable row level security;
alter table public.email_verifications enable row level security;

create policy "Public view agents" on public.agent_profiles for select using (true);
create policy "Own agent profile" on public.agent_profiles for all using (auth.uid() = user_id);
create policy "Public view companies" on public.company_profiles for select using (true);
create policy "Own company profile" on public.company_profiles for all using (auth.uid() = user_id);
create policy "View active missions" on public.missions for select using (status = 'ACTIVE');
create policy "Company manage missions" on public.missions for all using (company_id in (select id from public.company_profiles where user_id = auth.uid()));
create policy "Agent view own apps" on public.applications for select using (agent_id in (select id from public.agent_profiles where user_id = auth.uid()));
create policy "Agent create apps" on public.applications for insert with check (agent_id in (select id from public.agent_profiles where user_id = auth.uid()));
create policy "Company view apps" on public.applications for select using (mission_id in (select id from public.missions where company_id in (select id from public.company_profiles where user_id = auth.uid()))));
create policy "Company update apps" on public.applications for update using (mission_id in (select id from public.missions where company_id in (select id from public.company_profiles where user_id = auth.uid()))));
create policy "Company view matches" on public.matches for select using (mission_id in (select id from public.missions where company_id in (select id from public.company_profiles where user_id = auth.uid()))));
create policy "Agent view matches" on public.matches for select using (agent_id in (select id from public.agent_profiles where user_id = auth.uid()));

-- Indexes
create index if not exists idx_agent_profiles_available on public.agent_profiles(available);
create index if not exists idx_agent_profiles_score on public.agent_profiles(score desc);
create index if not exists idx_missions_status on public.missions(status);
create index if not exists idx_missions_sector on public.missions(sector);
create index if not exists idx_applications_agent on public.applications(agent_id);
create index if not exists idx_matches_score on public.matches(score desc);