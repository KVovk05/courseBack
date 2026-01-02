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

const allowedOrigins = [
  'http://localhost:5173',
  'https://course-front-ge05qci88-kyrylos-projects-adcc84b2.vercel.app',
  'https://course-front-osppbasxf-kyrylos-projects-adcc84b2.vercel.app', // додано новий Vercel-домен
  'https://courseproject-0teu.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Якщо запит без origin (наприклад, з Postman) — дозволяємо
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowedOrigins.join(','));
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Маршрути
app.use('/api', authRoutes);
app.use('/api', marksRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api', ordersRoutes); // Маршрути для замовлень


// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('✅ Сервер працює!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});
