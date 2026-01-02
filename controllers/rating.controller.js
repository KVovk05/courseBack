import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const submitRating = async (req, res) => {
  const { serviceId, initiativeId, userId, rate } = req.body;

  // Підтримка як services, так і initiatives для сумісності
  const entityId = serviceId || initiativeId;
  const collectionName = serviceId ? 'services' : 'initiatives';

  // Додаткові перевірки
  if (
    typeof entityId !== 'string' || entityId.trim() === '' ||
    typeof userId !== 'string' || userId.trim() === '' ||
    typeof rate !== 'number'
  ) {
    console.log('❌ Неправильні дані:', { entityId, userId, rate });
    return res.status(400).json({ error: 'Invalid or missing fields' });
  }

  try {
    console.log('📥 Отримано запит на рейтинг:', { entityId, userId, rate, collectionName });

    const ratingRef = db
      .collection(collectionName)
      .doc(entityId)
      .collection('ratings')
      .doc(userId);

    await ratingRef.set({ rate, userId }, { merge: true });

    const ratingsSnap = await db
      .collection(collectionName)
      .doc(entityId)
      .collection('ratings')
      .get();

    let total = 0;
    let count = 0;

    ratingsSnap.forEach(doc => {
      const data = doc.data();
      if (typeof data.rate === 'number') {
        total += data.rate;
        count += 1;
      }
    });

    const averageRating = count > 0 ? total / count : 0;

    await db.collection(collectionName).doc(entityId).update({
      averageRating
    });

    console.log('✅ Оцінка оновлена. Середній рейтинг:', averageRating.toFixed(2));
    res.status(200).json({ message: 'Rating submitted', averageRating });
  } catch (error) {
    console.error('❌ Error submitting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
