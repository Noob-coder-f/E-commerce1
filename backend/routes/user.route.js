

import express from 'express';

import { getUsers, login, signup } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
// import Userorder from '../model/userOrder.model.js';
// import { orderCard } from '../controllers/admin.controller.js';
import { placeOrder ,userOders } from '../controllers/user.controller.js';
import { authorizeRoles } from '../middleware/role.middleware.js';



const router =express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/users',authenticateToken,authorizeRoles('admin') ,getUsers);
// router.post('/order',authenticateToken, orderCard)
router.post('/order', authenticateToken,authorizeRoles('user'), placeOrder);
router.get('/userorders', authenticateToken,authorizeRoles('admin','user'), userOders);
export default router;

