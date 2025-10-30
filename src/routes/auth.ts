import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { authLimiter } from '../middlewares/security';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phone
 *         - password
 *         - deviceId
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *           description: User's first name
 *         lastName:
 *           type: string
 *           example: Doe
 *           description: User's last name
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *           description: User's phone number
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: password123
 *           description: Must be at least 6 characters long
 *         deviceId:
 *           type: string
 *           example: "device-123456"
 *           description: Unique device identifier
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - deviceId
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *         deviceId:
 *           type: string
 *           example: "device-123456"
 *           description: Unique device identifier
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Registration successful. Please wait for device verification."
 *         userId:
 *           type: string
 *           example: "507f1f77bcf86cd799439011"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT access token
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             email:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             phone:
 *               type: string
 *             balance:
 *               type: number
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully - awaiting device verification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation failed or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       429:
 *         description: Too many registration attempts
 */
router.post('/register', authLimiter, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', authLimiter, login);

export default router;