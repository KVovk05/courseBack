import express from 'express';
import OrdersController from '../controllers/orders.controller.js';
import verifyFirebaseToken from '../middleware/verifyToken.js';

const router = express.Router();
const ordersController = new OrdersController();

// Отримати всі замовлення користувача
router.get('/orders/user/:userId', verifyFirebaseToken, ordersController.getUserOrders);

// Отримати замовлення за ID
router.get('/orders/:orderId', verifyFirebaseToken, ordersController.getOrderById);

// Створити нове замовлення
router.post('/orders', verifyFirebaseToken, ordersController.createOrder);

// Оновити статус замовлення
router.patch('/orders/:orderId/status', verifyFirebaseToken, ordersController.updateOrderStatus);

// Додати оцінку до замовлення
router.patch('/orders/:orderId/rating', verifyFirebaseToken, ordersController.addRating);

export default router;

