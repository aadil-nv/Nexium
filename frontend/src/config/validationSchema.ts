// validationSchema.ts
import { z } from 'zod';

// Password regex: At least 6 characters, one uppercase letter, one number, and one symbol
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }), // Validates proper email format
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters long' }) // Minimum 6 characters
    .regex(passwordRegex, { message: 'Password must contain at least one uppercase letter, one number, and one symbol' }), // Regex validation
});
