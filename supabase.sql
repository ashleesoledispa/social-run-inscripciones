-- Ejecuta este SQL en Supabase > SQL Editor > New query.
-- Reemplaza admin@tucorreo.com por el correo que usarás para entrar a /admin.
create table if not exists public.social_run_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  age integer not null check (age between 1 and 100),
  phone text not null check (char_length(trim(phone)) between 7 and 20),
  created_at timestamptz not null default now()
);

alter table public.social_run_registrations enable row level security;

drop policy if exists "Public can register for Social Run" on public.social_run_registrations;
create policy "Public can register for Social Run"
on public.social_run_registrations
for insert
to anon
with check (
  char_length(trim(full_name)) between 2 and 100
  and age between 1 and 100
  and char_length(trim(phone)) between 7 and 20
);

-- Solo permite LEER la tabla a una sesión iniciada cuyo correo coincida
-- con el correo de administrador que configures aquí.
drop policy if exists "Admin can view Social Run registrations" on public.social_run_registrations;
create policy "Admin can view Social Run registrations"
on public.social_run_registrations
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'admin@tucorreo.com');

-- No se crean políticas públicas para actualizar o borrar registros.
