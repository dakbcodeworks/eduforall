import { ObjectId } from 'mongodb';

export interface Settings {
  _id?: ObjectId;
  upiId: string;
  upiName: string;
  qrCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const defaultSettings: Omit<Settings, '_id'> = {
  upiId: '',
  upiName: '',
  qrCode: null,
  createdAt: new Date(),
  updatedAt: new Date()
}; 