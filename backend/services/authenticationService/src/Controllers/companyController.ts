import { Request, Response } from 'express';
import { CompanyService } from '../Services/implementaion/companyService';
import { ObjectId } from 'mongodb'; // Ensure you import ObjectId for MongoDB document ID

const companyService = new CompanyService();

export class CompanyController {
    async register(req: Request, res: Response): Promise<Response> {
        console.log("Hitting company controller...");
    
        const { companyName, registrationNumber, email, password, address, phone, website, documents } = req.body;
    
    
        if (!companyName || !registrationNumber || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        try {
           
            const { tokens, message } = await companyService.register({
                name: companyName,
                registrationNumber: registrationNumber,
                email: email,
                password: password,
                address: address,
                phone: phone,
                website: website,
                documents: documents || [],
                subscription: {
                    planName: 'Trial',
                    planType: 'Trial',
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    status: 'Active',
                },
            });
    
            // Respond with success, tokens, and a message
            return res.status(201).json({
                message: message || 'Registration successful',
                tokens
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                // Handle specific registration errors
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: 'Registration failed', error: 'Unknown error occurred' });
        }
    }
    
    
    async login(req: Request, res: Response): Promise<Response> {
        console.log("compnayController login touched...");
        
        const { email, password} = req.body;

        // Validate input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const tokens = await companyService.login(email, password);
            return res.status(200).json({
                message: 'Login successful',
                ...tokens,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
            return res.status(401).json({ message: 'Login failed', error: 'Unknown error occurred' });
        }
    }

    async validateOtp(req: Request, res: Response): Promise<Response> {
        console.log("hitting validateOtp...");
        
        const { email, otp } = req.body;
        const response = await companyService.validateOtp(email, otp);
        return res.status(200).json(response);
    }
}
