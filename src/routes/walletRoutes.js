import { Router } from 'express';
import { transferMoney } from '../controllers/walletController.js';
import { toggleAccountStatus } from '../controllers/StatusController.js';

const router = Router();

router.post('/transfer', transferMoney);
router.patch('/accounts/:id/toggle-status', toggleAccountStatus);

export default router;