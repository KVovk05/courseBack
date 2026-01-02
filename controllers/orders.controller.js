import { db } from '../config/dbConfig.js';

class OrdersController {
    // Отримати всі замовлення користувача
    async getUserOrders(req, res) {
        try {
            const { userId } = req.params;

            if (!userId) {
                return res.status(400).json({
                    statusCode: 400,
                    error: "User ID is required"
                });
            }

            const ordersSnapshot = await db
                .collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            const orders = [];
            ordersSnapshot.forEach(doc => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            res.status(200).json({
                statusCode: 200,
                data: orders
            });
        } catch (error) {
            console.error('Error fetching user orders:', error);
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }

    // Отримати замовлення за ID
    async getOrderById(req, res) {
        try {
            const { orderId } = req.params;

            const orderDoc = await db.collection('orders').doc(orderId).get();

            if (!orderDoc.exists) {
                return res.status(404).json({
                    statusCode: 404,
                    error: "Order not found"
                });
            }

            res.status(200).json({
                statusCode: 200,
                data: {
                    id: orderDoc.id,
                    ...orderDoc.data()
                }
            });
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }

    // Створити нове замовлення
    async createOrder(req, res) {
        try {
            const {
                userId,
                userEmail,
                serviceId,
                calculatorData,
                price,
                name,
                phone,
                address,
                date,
                time,
                comments
            } = req.body;

            // Валідація обов'язкових полів
            if (!userId || !userEmail || !price || !name || !phone || !address || !date) {
                return res.status(400).json({
                    statusCode: 400,
                    error: "Missing required fields"
                });
            }

            const orderData = {
                userId,
                userEmail,
                serviceId: serviceId || null,
                calculatorData: calculatorData || null,
                price: Number(price),
                name,
                phone,
                address,
                date,
                time: time || null,
                comments: comments || '',
                status: 'pending',
                userRating: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const docRef = await db.collection('orders').add(orderData);

            res.status(201).json({
                statusCode: 201,
                message: "Order created successfully",
                data: {
                    id: docRef.id,
                    ...orderData
                }
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }

    // Оновити статус замовлення
    async updateOrderStatus(req, res) {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    statusCode: 400,
                    error: "Invalid status"
                });
            }

            const orderRef = db.collection('orders').doc(orderId);
            const orderDoc = await orderRef.get();

            if (!orderDoc.exists) {
                return res.status(404).json({
                    statusCode: 404,
                    error: "Order not found"
                });
            }

            await orderRef.update({
                status,
                updatedAt: new Date()
            });

            res.status(200).json({
                statusCode: 200,
                message: "Order status updated",
                data: {
                    id: orderId,
                    status
                }
            });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }

    // Додати оцінку до замовлення
    async addRating(req, res) {
        try {
            const { orderId } = req.params;
            const { rating } = req.body;

            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({
                    statusCode: 400,
                    error: "Rating must be between 1 and 5"
                });
            }

            const orderRef = db.collection('orders').doc(orderId);
            const orderDoc = await orderRef.get();

            if (!orderDoc.exists) {
                return res.status(404).json({
                    statusCode: 404,
                    error: "Order not found"
                });
            }

            const orderData = orderDoc.data();

            // Оновити оцінку в замовленні
            await orderRef.update({
                userRating: Number(rating),
                updatedAt: new Date()
            });

            // Якщо є serviceId, оновити рейтинг послуги
            if (orderData.serviceId) {
                // Знайти документ послуги за полем id
                const servicesSnapshot = await db
                    .collection('services')
                    .where('id', '==', orderData.serviceId)
                    .limit(1)
                    .get();

                if (!servicesSnapshot.empty) {
                    const serviceDoc = servicesSnapshot.docs[0];
                    const serviceId = serviceDoc.id;

                    // Додати/оновить оцінку в підколекції ratings
                    const ratingRef = db
                        .collection('services')
                        .doc(serviceId)
                        .collection('ratings')
                        .doc(orderData.userId);

                    await ratingRef.set({
                        userId: orderData.userId,
                        rate: Number(rating),
                        createdAt: new Date()
                    }, { merge: true });

                    // Перерахувати середню оцінку
                    const ratingsSnapshot = await db
                        .collection('services')
                        .doc(serviceId)
                        .collection('ratings')
                        .get();

                    let total = 0;
                    let count = 0;
                    ratingsSnapshot.forEach(doc => {
                        const data = doc.data();
                        if (typeof data.rate === 'number') {
                            total += data.rate;
                            count += 1;
                        }
                    });

                    const averageRating = count > 0 ? total / count : 0;

                    await db.collection('services').doc(serviceId).update({
                        averageRating: Number(averageRating.toFixed(2))
                    });
                }
            }

            res.status(200).json({
                statusCode: 200,
                message: "Rating added successfully",
                data: {
                    orderId,
                    rating
                }
            });
        } catch (error) {
            console.error('Error adding rating:', error);
            res.status(500).json({
                statusCode: 500,
                error: "Server error"
            });
        }
    }
}

export default OrdersController;

