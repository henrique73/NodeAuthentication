import mongoose, { mongo } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  facebookId: {
    type: String,
    required: false,
    unique: false,
  },
  googleId: {
    type: String,
    required: false,
    unique: false,
  },
  appleId: {
    type: String,
    required: false,
    unique: false,
  },
  verifiedEmail: {
    type: Number,
    required: false,
    unique: false,
  },
});

export default mongoose.model<IUser>('User', userSchema);
