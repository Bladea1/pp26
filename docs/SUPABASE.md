# Подключение Supabase

## 1. Проект в Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. В **SQL Editor** выполните файл `supabase/schema.sql`.
3. Выполните **`supabase/auth.sql`** — триггер профиля при регистрации.
4. Выполните **`supabase/writes.sql`** — политики записи для авторизованных пользователей.
5. Затем выполните **`supabase/seed.sql`** — проекты, журнал, реактивы, профили, ленту активности.

## 2. Переменные окружения

Скопируйте `.env.example` в `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Сайт читает и пишет данные только через Supabase. Без ключей каталог и журнал будут пустыми.

## 3. Репозиторий в коде

| Модуль | Назначение |
|--------|------------|
| `src/lib/config.js` | `hasSupabaseEnv()` |
| `src/lib/supabase/client.js` | Клиент для браузера |
| `src/lib/supabase/server.js` | Клиент для Server Components |
| `src/lib/repository/projects.js` | Проекты, реактивы, наблюдения, история |
| `src/lib/repository/journal.js` | Журнал |
| `src/lib/repository/misc.js` | Профиль, сообщество, статистика лаборатории |
| `src/lib/auth/project-actions.js` | Создание образца и реактива |

## 4. Авторизация

1. **Authentication → Providers** — включите **Email**.
2. **Authentication → URL Configuration** — redirect: `http://localhost:3000/auth/callback`
3. Страницы `/login`, `/register`. После входа — `/profile`.
4. Без входа закрыты: `/profile`, `/projects/new`, `/projects/[slug]/reagent`.

## 5. Поля

В таблице `projects` поле **`slug`** используется в URL (`/projects/gorod-bez-otrazheniy`). Журнал: **`body`** — JSON-массив блоков `{ type: "p" | "h2", text: "..." }`.
