import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import marksRoutes from './routes/marks.routes.js';
import ratingRoutes from './routes/rating.js'; // ← додано
import { db } from './config/dbConfig.js';




dotenv.config();
 // ← додаємо firebase-admin


const app = express();
app.use(express.json())
app.use(cors({

  credentials: true // якщо використовуєш cookies або auth
}));
// Маршрути
app.use('/api', authRoutes);
app.use('/api', marksRoutes);
app.use('/api/rating', ratingRoutes); // ← маршрут для рейтингу


// Тестовий маршрут
app.get('/', (req, res) => {
  res.send('✅ Сервер працює!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});
