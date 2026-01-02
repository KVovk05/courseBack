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
  'https://course-front-ge05qci88-kyrylos-projects-adcc84b2.vercel.app', // ваш Vercel-домен
  'https://courseproject-0teu.onrender.com' // якщо потрібно
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

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
