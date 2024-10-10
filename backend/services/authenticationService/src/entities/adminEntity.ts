import { ObjectId } from 'mongoose'; // Import ObjectId from mongoose

export interface IAdmin {
    _id: ObjectId; // Use mongoose ObjectId type
    email: string;
    password: string;
    role: string;
}
