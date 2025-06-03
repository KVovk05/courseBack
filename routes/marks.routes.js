import express from 'express'; 
import MarksController from '../controllers/marks.controller.js'
const router = express.Router();
const marksController = new MarksController();

router.get('/avg-mark/:id', marksController.getInitiativeRatings);

export default router;