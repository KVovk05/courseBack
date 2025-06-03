import express from 'express';
import { submitRating } from '../controllers/rating.controller.js';

const router = express.Router();

router.post('/', submitRating);

export default router;
