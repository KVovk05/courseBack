import { db } from '../config/dbConfig.js';

class MarksController {
  async getInitiativeRatings(req, res) {
    try {
      const { id } = req.params; // Отримуємо ID ініціативи з параметрів маршруту

      console.log('db:', db); // Діагностика

      // Отримуємо документ ініціативи за ID
      const initiativeRef = db.collection('initiatives').doc(id);
      const initiativeSnap = await initiativeRef.get();

      if (!initiativeSnap.exists) {
        return res.status(404).json({ message: 'Initiative not found' });
      }

      // Отримуємо всі документи з підколекції ratings
      const ratingsSnap = await initiativeRef.collection('ratings').get();
      const ratings = ratingsSnap.docs.map(doc => doc.data());

      if (ratings.length === 0) {
        return res.status(404).json({ message: 'No ratings found for this initiative' });
      }

      // Обчислюємо середнє значення
      const total = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating = Number((total / ratings.length).toFixed(2));

      // Трансформуємо дані для клієнта
      const transformedData = {
        id,
        averageRating,
        ratingsCount: ratings.length,
        ratings
      };

      return res.status(200).json(transformedData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default MarksController;