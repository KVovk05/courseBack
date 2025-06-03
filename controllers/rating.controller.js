import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const submitRating = async (req, res) => {
  const { initiativeId, userId, rate } = req.body;

  // Додаткові перевірки
  if (
    typeof initiativeId !== 'string' || initiativeId.trim() === '' ||
    typeof userId !== 'string' || userId.trim() === '' ||
    typeof rate !== 'number'
  ) {
    console.log('❌ Неправильні дані:', { initiativeId, userId, rate });
    return res.status(400).json({ error: 'Invalid or missing fields' });
  }

  try {
    console.log('📥 Отримано запит на рейтинг:', { initiativeId, userId, rate });

    const ratingRef = db
      .collection('initiatives')
      .doc(initiativeId)
      .collection('ratings')
      .doc(userId);

    await ratingRef.set({ rate,userId }, { merge: true });

    const ratingsSnap = await db
      .collection('initiatives')
      .doc(initiativeId)
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

    await db.collection('initiatives').doc(initiativeId).update({
      averageRating
    });

    console.log('✅ Оцінка оновлена. Середній рейтинг:', averageRating.toFixed(2));
    res.status(200).json({ message: 'Rating submitted', averageRating });
  } catch (error) {
    console.error('❌ Error submitting rating:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
