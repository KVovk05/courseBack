import { db } from '../config/dbConfig.js';

class MarksController {
  async getInitiativeRatings(req, res) {
    try {
      const { id } = req.params; 
      const { type } = req.query; // Додаємо параметр type для визначення колекції

      // Підтримка як services, так і initiatives
      const collectionName = type === 'service' ? 'services' : 'initiatives';

      console.log('db:', db); 

     
      const entityRef = db.collection(collectionName).doc(id);
      const entitySnap = await entityRef.get();

      if (!entitySnap.exists) {
        return res.status(404).json({ message: `${collectionName === 'services' ? 'Service' : 'Initiative'} not found` });
      }

     
      const ratingsSnap = await entityRef.collection('ratings').get();
      const ratings = ratingsSnap.docs.map(doc => doc.data());

      if (ratings.length === 0) {
        return res.status(200).json({ 
          id,
          averageRating: 0,
          ratingsCount: 0,
          ratings: []
        });
      }

      
      const total = ratings.reduce((sum, rating) => sum + rating.rate, 0);
      const averageRating = Number((total / ratings.length).toFixed(2));

   
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