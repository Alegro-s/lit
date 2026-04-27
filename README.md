# LIT Website

Landing + backend for lead form email delivery.

## Быстрый запуск после клона из Git

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` в корне проекта на основе `.env.example`.

Пример:

```env
PORT=5000
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=your-email@yandex.ru
SMTP_PASS=your-app-password
LEAD_RECEIVER=your-email@yandex.ru
```

3. Запустить frontend и backend вместе:

```bash
npm run start:all
```

## Важные заметки по почте

- Для Яндекса нужен **пароль приложения**, а не обычный пароль от аккаунта.
- После старта backend в консоли будет `SMTP ready` или ошибка `SMTP verify failed`.
- Endpoint для формы: `POST /api/lead`.

## Скрипты

- `npm run start:client` — только frontend
- `npm run start:server` — только backend
- `npm run start:all` — frontend + backend
- `npm run build` — production build
