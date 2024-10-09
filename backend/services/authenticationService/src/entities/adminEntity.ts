import { Document, ObjectId } from 'mongoose';

export interface IAdmin extends Document {
    _id: ObjectId; // If you want to include the ObjectId type for MongoDB document IDs
    email: string;
    password: string;
    role: string; // You can use a union type if there are specific roles
    createdAt: Date;
    updatedAt: Date;
}
