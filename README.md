# Vol-Platform Backend (Node.js + Express)

## Опис
Це бекенд для платформи замовлення клінінгових послуг. Реалізовано на Node.js + Express, з інтеграцією Firebase Admin SDK для роботи з Firestore та авторизацією через JWT.

## Основні можливості
- REST API для замовлень, рейтингів, користувачів
- Перевірка токену користувача (JWT/Firebase)
- Оновлення статусу замовлень (адмін)
- Зберігання оцінок та розрахунок середнього рейтингу

## Структура проекту
- `controllers/` — логіка для orders, rating, auth
- `routes/` — маршрути API
- `middleware/` — перевірка токену
- `config/` — налаштування бази даних
- `server.js` — точка входу

## Запуск
1. Встановіть залежності:
   ```sh
   npm install
   ```
2. Створіть файл `.env` у папці `ServerWebLab5-main` з налаштуваннями Firebase:
   ```env
   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=...
   JWT_SECRET=...
   ```
3. Запустіть сервер:
   ```sh
   npm run dev
   ```
   або
   ```sh
   node server.js
   ```
4. API буде доступне на [http://localhost:5000](http://localhost:5000)

## Важливо
- Для роботи потрібен налаштований Firebase проект (див. `FIREBASE_SETUP.md`).
- Для захищених маршрутів потрібен валідний JWT токен (отримується після логіну).
- Фронтенд очікує API на `VITE_API_BASE_URL` (див. `.env` у фронті).

## Автор
Вовк Кирило, ОІ-22
