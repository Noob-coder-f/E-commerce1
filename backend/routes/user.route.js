

import express from 'express';

import { getUsers, login, signup } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import Userorder from '../model/userOrder.model.js';
// import { orderCard } from '../controllers/admin.controller.js';
import { placeOrder ,userOders } from '../controllers/user.controller.js';



const router =express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/users',authenticateToken ,getUsers);
// router.post('/order',authenticateToken, orderCard)
router.post('/order', authenticateToken, placeOrder);
router.get('/userorders', authenticateToken, userOders);
export default router;

