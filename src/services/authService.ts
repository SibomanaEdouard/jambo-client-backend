import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User';
import { AuthResponseDTO } from '../dto/UserDto';

export class AuthService {
  static async registerUser(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    deviceId: string;
  }) {
    const { firstName, lastName, email, phone, password, deviceId } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      throw new Error('User with this email or phone already exists');
    }

    // Hash password with SHA-512 equivalent (bcrypt with sufficient rounds)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with initial device
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      devices: [{
        deviceId,
        verified: false // Requires admin verification
      }]
    });

    await user.save();

    return user;
  }

  static async loginUser(email: string, password: string, deviceId: string) {
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if device exists and is verified
    let device = user.devices.find(d => d.deviceId === deviceId);
    const deviceVerified = device ? device.verified : false;

    // If device doesn't exist, add it (requires verification)
    if (!device) {
      user.devices.push({
        deviceId,
        verified: false
      });
      await user.save();
    }

    // Validate environment variables
    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Generate JWT token with proper typing
    const payload = { 
      userId: user._id, 
      deviceId,
      email: user.email 
    };

// Determine numeric or string expiry and provide a value compatible with SignOptions
const rawExpires = process.env.JWT_EXPIRES_IN;
const expiresIn: string | number =
  rawExpires && /^[0-9]+$/.test(rawExpires) ? Number(rawExpires) : (rawExpires ?? '7d');

const options: SignOptions = {
  expiresIn: expiresIn as unknown as any
};

    const token = jwt.sign(payload, jwtSecret, options);

    // Update last login for verified devices
    if (deviceVerified && device) {
      device.lastLogin = new Date();
      await user.save();
    }

    return new AuthResponseDTO(user, token, deviceVerified);
  }
}