import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import marksRoutes from './routes/marks.routes.js';
import ratingRoutes from './routes/rating.js';
import ordersRoutes from './routes/orders.routes.js';
import { db } from './config/dbConfig.js';

dotenv.config();

const app = express();

// Список разрешенных адресов
// ВАЖНО: Добавь сюда основной домен Vercel (без хэшей osppbasxf), 
// чтобы он работал всегда, даже после обновлений фронтенда.
app.use(cors({
  origin: function (origin, callback) {
    // 1. Разрешаем запросы без origin (Postman, серверные скрипты)
    if (!origin) return callback(null, true);

    // 2. Проверяем точные совпадения (Localhost и Render)
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5000',
      'https://courseproject-0teu.onrender.com'
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. 🔥 ГЛАВНОЕ: Разрешаем ВСЕ поддомены Vercel
    // Це дозволить і production, і preview посилання
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // Якщо нічого не підійшло — блокуємо і пишемо в лог, ХТО це був
    console.log('🚫 BLOCKED BY CORS:', origin); 
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json()); // Не забудь парсер JSON, если его не было

// Маршрути
app.use('/api', authRoutes);
app.use('/api', marksRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api', ordersRoutes);

// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('✅ Сервер працює!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});