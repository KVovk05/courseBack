import express from 'express';
import { submitRating } from '../controllers/rating.controller.js';
import verifyFirebaseToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyFirebaseToken, submitRating);

export default router;
