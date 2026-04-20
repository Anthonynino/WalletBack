import { Router } from 'express';
import { transferMoney, getAccountById } from '../controllers/WalletController.js';

const router = Router();

router.post('/transfer', transferMoney);
router.get('/get-account-by-id/:id', getAccountById);


export default router;