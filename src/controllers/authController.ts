import { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthService } from '../services/authService';
import { handleValidationErrors } from '../middlewares/security';

export const register = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const user = await AuthService.registerUser(req.body);
      res.status(201).json({
        message: 'Registration successful. Please wait for device verification.',
        userId: user._id
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
];

export const login = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password, deviceId } = req.body;
      const authResponse = await AuthService.loginUser(email, password, deviceId);
      
      res.json(authResponse);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }
];