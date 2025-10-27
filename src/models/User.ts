import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  balance: number;
  devices: {
    deviceId: string;
    verified: boolean;
    verifiedAt?: Date;
    lastLogin?: Date;
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0, min: 0 },
  devices: [{
    deviceId: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
    lastLogin: Date
  }],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', userSchema);