import express from 'express';
import { addCard ,getCards } from '../controllers/admin.controller.js';

const router = express.Router();    

// Route to add a new card
router.post('/add-card', addCard);

router.get('/get-cards', getCards);

export default router;