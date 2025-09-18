import express from 'express';

const router =express.Router();
import { getKey, paymentSuccess, verifyPayment } from '../controllers/payment.controller.js';

router.post('/payment/process',paymentSuccess);
router.get('/payment/getkey',getKey);
router.post('/payment/verification',verifyPayment);




export default router;