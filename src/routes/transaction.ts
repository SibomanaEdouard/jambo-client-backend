import { Router } from 'express';
import { deposit, withdraw, getTransactions } from '../controllers/transactionController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     DepositRequest:
 *       type: object
 *       required:
 *         - amount
 *         - description
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           example: 100.50
 *           description: Deposit amount (must be greater than 0)
 *         description:
 *           type: string
 *           example: "Initial deposit"
 *           description: Transaction description
 *     WithdrawRequest:
 *       type: object
 *       required:
 *         - amount
 *         - description
 *       properties:
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           example: 50.25
 *           description: Withdrawal amount (must be greater than 0)
 *         description:
 *           type: string
 *           example: "ATM withdrawal"
 *           description: Transaction description
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Deposit successful"
 *         transaction:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             type:
 *               type: string
 *               enum: [deposit, withdrawal]
 *             amount:
 *               type: number
 *             description:
 *               type: string
 *             balance:
 *               type: number
 *             status:
 *               type: string
 *               enum: [pending, completed, failed]
 *             createdAt:
 *               type: string
 *               format: date-time
 *     TransactionsHistory:
 *       type: object
 *       properties:
 *         transactions:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [deposit, withdrawal]
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               balance:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed]
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         total:
 *           type: integer
 *           description: Total number of transactions
 *         page:
 *           type: integer
 *           description: Current page number
 *         totalPages:
 *           type: integer
 *           description: Total number of pages
 *         hasNext:
 *           type: boolean
 *           description: Whether there are more pages
 *         hasPrev:
 *           type: boolean
 *           description: Whether there are previous pages
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Financial transactions endpoints
 */

/**
 * @swagger
 * /api/transactions/deposit:
 *   post:
 *     summary: Deposit money to account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositRequest'
 *     responses:
 *       200:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Invalid amount or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/deposit', deposit);

/**
 * @swagger
 * /api/transactions/withdraw:
 *   post:
 *     summary: Withdraw money from account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawRequest'
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Invalid amount, insufficient funds, or validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/withdraw', withdraw);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: Transaction history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionsHistory'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/history', getTransactions);

export default router;