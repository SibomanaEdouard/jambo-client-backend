import { Router } from 'express';
import { deposit, withdraw, getTransactions } from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.post('/deposit', deposit);
router.post('/withdraw', withdraw);
router.get('/history', getTransactions);

export default router;