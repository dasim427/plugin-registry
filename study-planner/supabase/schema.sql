-- Схема для синхронизации планировщика между устройствами.
-- Выполняется один раз в Supabase: SQL Editor → New query → вставить → Run.
--
-- Состояние хранится двумя строками на пользователя:
--   kind = 'tasks'    — список заданий (меняется часто, весит мало)
--   kind = 'settings' — настройки и расписание пар (меняется редко, весит больше)
-- Разделение нужно, чтобы отметка «+30 мин» не гоняла по сети всё расписание.

create table if not exists public.planner_state (
  user_id    uuid        not null references auth.users on delete cascade,
  kind       text        not null check (kind in ('tasks', 'settings')),
  data       jsonb       not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, kind)
);

alter table public.planner_state enable row level security;

-- Каждый видит и меняет только свои строки. Анонимным доступ не выдаётся вовсе,
-- поэтому публичный anon-ключ в коде страницы сам по себе ничего не открывает.
drop policy if exists "planner_state is private" on public.planner_state;
create policy "planner_state is private"
  on public.planner_state
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.planner_state to authenticated;

-- updated_at проставляется сервером, а не клиентом: по нему решается,
-- чья версия свежее, когда телефон и ноутбук разошлись.
create or replace function public.planner_state_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists planner_state_touch on public.planner_state;
create trigger planner_state_touch
  before insert or update on public.planner_state
  for each row execute function public.planner_state_touch();
