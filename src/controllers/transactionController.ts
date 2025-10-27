import { Response } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middlewares/auth';
import { TransactionService } from '../services/transactionService';
import { handleValidationErrors } from '../middlewares/security';

export const deposit = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('description').notEmpty().withMessage('Description is required'),
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const { amount, description } = req.body;
      const transaction = await TransactionService.deposit(
        req.user!._id.toString(),
        amount,
        description
      );
      res.json({ message: 'Deposit successful', transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
];

export const withdraw = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
  body('description').notEmpty().withMessage('Description is required'),
  handleValidationErrors,
  async (req: AuthRequest, res: Response) => {
    try {
      const { amount, description } = req.body;
      const transaction = await TransactionService.withdraw(
        req.user!._id.toString(),
        amount,
        description
      );
      res.json({ message: 'Withdrawal successful', transaction });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
];

export const getTransactions = [
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const history = await TransactionService.getTransactionHistory(
        req.user!._id.toString(),
        page,
        limit
      );
      res.json(history);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
];