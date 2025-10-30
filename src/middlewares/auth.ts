import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
  admin?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if it's an admin token
    if (decoded.isAdmin) {
      req.admin = decoded;
      return next();
    }

    // This is a regular user request - validate user and device
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user not found.' });
    }

    // Check if device is verified
    const device = user.devices.find(d => d.deviceId === decoded.deviceId);
    if (!device || !device.verified) {
      return res.status(401).json({ message: 'Device not verified. Please contact admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if it's an admin token
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Reject admin tokens for user-only routes
    if (decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access not allowed for this route.' });
    }

    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid token or user not found.' });
    }

    // Check if device is verified
    const device = user.devices.find(d => d.deviceId === decoded.deviceId);
    if (!device || !device.verified) {
      return res.status(401).json({ message: 'Device not verified. Please contact admin.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

//  Combined middleware that accepts both but distinguishes them
export const authenticateAny = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    if (decoded.isAdmin) {
      // Admin authentication
      req.admin = decoded;
    } else {
      // User authentication
      const user = await User.findById(decoded.userId);
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid token or user not found.' });
      }

      // Check if device is verified
      const device = user.devices.find(d => d.deviceId === decoded.deviceId);
      if (!device || !device.verified) {
        return res.status(401).json({ message: 'Device not verified. Please contact admin.' });
      }

      req.user = user;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};