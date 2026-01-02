import express from 'express'; 
import MarksController from '../controllers/marks.controller.js';
import verifyFirebaseToken from '../middleware/verifyToken.js';

const router = express.Router();
const marksController = new MarksController();

router.get('/avg-mark/:id', verifyFirebaseToken, marksController.getInitiativeRatings);

export default router;