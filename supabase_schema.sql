-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Public user data)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- LEADS (The core CRM data)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  
  first_name text,
  last_name text,
  email text,
  company text,
  linkedin_url text,
  job_title text,
  
  status text default 'new', -- new, contacted, replied, negotiation, won, lost
  notes text,
  
  -- The "Hook" / Recon data
  recon_summary text, 
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- JOBS (Background tasks queue for Agent)
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  
  type text not null, -- 'search', 'enrich', 'draft_email'
  payload jsonb not null, -- The instructions (e.g. { "query": "CTOs in Miami" })
  status text default 'pending', -- pending, processing, completed, failed
  
  result jsonb,
  error_message text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES (Data Isolation)

-- Profiles: Users can read/update their own profile
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Leads: Users can ONLY see their own leads
alter table leads enable row level security;
create policy "Users can view own leads" on leads for select using (auth.uid() = user_id);
create policy "Users can insert own leads" on leads for insert with check (auth.uid() = user_id);
create policy "Users can update own leads" on leads for update using (auth.uid() = user_id);
create policy "Users can delete own leads" on leads for delete using (auth.uid() = user_id);

-- Jobs: Users can ONLY see their own jobs
alter table jobs enable row level security;
create policy "Users can view own jobs" on jobs for select using (auth.uid() = user_id);
create policy "Users can insert own jobs" on jobs for insert with check (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
