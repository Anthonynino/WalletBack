import { Router } from 'express';
import { transferMoney } from '../controllers/walletController.js';

const router = Router();

router.post('/transfer', transferMoney);

export default router;