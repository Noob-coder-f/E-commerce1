import express from 'express';
import { addCard ,getCards } from '../controllers/admin.controller.js';
import {authenticateToken} from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();    

// Route to add a new card
router.post('/add-card',authenticateToken,authorizeRoles('admin'), addCard);

router.get('/get-cards',authenticateToken, getCards);

export default router;