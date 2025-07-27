

import express from 'express';

import { getUsers, login, signup } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';



const router =express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/users',authenticateToken ,getUsers);
export default router;

