import { TransactionDTO } from '../dto/TransactionDto';
import Transaction from '../models/Transaction';
import User from '../models/User';

export class TransactionService {
  static async deposit(userId: string, amount: number, description: string) {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore + amount;

    // Update user balance
    user.balance = balanceAfter;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'deposit',
      amount,
      balanceBefore,
      balanceAfter,
      description,
      status: 'completed'
    });

    await transaction.save();

    return new TransactionDTO(transaction);
  }

  static async withdraw(userId: string, amount: number, description: string) {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < amount) {
      throw new Error('Insufficient balance');
    }

    const balanceBefore = user.balance;
    const balanceAfter = balanceBefore - amount;

    // Update user balance
    user.balance = balanceAfter;
    await user.save();

    // Create transaction record
    const transaction = new Transaction({
      userId,
      type: 'withdrawal',
      amount,
      balanceBefore,
      balanceAfter,
      description,
      status: 'completed'
    });

    await transaction.save();

    return new TransactionDTO(transaction);
  }

  static async getTransactionHistory(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId });

    return {
      transactions: transactions.map(t => new TransactionDTO(t)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}