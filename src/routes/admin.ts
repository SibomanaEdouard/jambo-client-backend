import express from 'express';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { authenticateAdmin } from '../middlewares/auth';

const router = express.Router();

// Get all users with pagination and search
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    // Build search query
    const searchQuery = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(searchQuery)
      .select('-password') // This is  to exclude password
      .skip(skip)
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(searchQuery);

    res.json({
      users: users.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        devices: user.devices,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.post('/users/:userId/verify-device', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { deviceId } = req.body;

    console.log('📥 Client Backend - Received verify request:', {
      userId,
      deviceId,
      isValidObjectId: /^[0-9a-fA-F]{24}$/.test(userId)
    });

    // Validate userId 
    if (!userId || userId === 'undefined' || !/^[0-9a-fA-F]{24}$/.test(userId)) {
      return res.status(400).json({ 
        message: 'Invalid User ID format',
        received: userId
      });
    }

    if (!deviceId) {
      return res.status(400).json({ message: 'Device ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the device and verify it
    const device = user.devices.find(d => d.deviceId === deviceId);
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.verified = true;
    device.verifiedAt = new Date();
    
    await user.save();

    res.json({ 
      message: 'Device verified successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        devices: user.devices
      }
    });
  } catch (error) {
    console.error('❌ Client Backend - Error verifying device:', error);
    res.status(500).json({ 
      message: 'Failed to verify device',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get user details with transactions
router.get('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        balance: user.balance,
        devices: user.devices,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      recentTransactions: transactions
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    const usersWithPendingDevices = await User.find({
      'devices.verified': false
    });
    
    const pendingDevices = usersWithPendingDevices.reduce((count, user) => {
      return count + user.devices.filter(device => !device.verified).length;
    }, 0);

    const totalBalanceResult = await User.aggregate([
      { $group: { _id: null, total: { $sum: '$balance' } } }
    ]);

    const recentTransactions = await Transaction.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $sort: { createdAt: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          type: 1,
          amount: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.email': 1
        }
      }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      pendingDevices,
      totalBalance: totalBalanceResult[0]?.total || 0,
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

export default router;