import { Request, Response } from 'express';
import { CompanyService } from '../Services/implementaion/companyService';
import { ObjectId } from 'mongodb'; // Ensure you import ObjectId for MongoDB document ID

const companyService = new CompanyService();

export class CompanyController {
    async register(req: Request, res: Response): Promise<Response> {
        console.log("Hitting company controller...");

        const { company_name, registration_number, email, password, address, phone, website, documents } = req.body;

        if (!company_name || !registration_number || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            // Register company and get tokens
            const tokens = await companyService.register({
                name: company_name,
                registrationNumber: registration_number,
                email: email,
                password: password,
                address: address, // Add address if needed
                phone: phone,  // Add phone if needed
                website: website, // Add website if needed
                documents: documents || [], // Add documents if needed
                subscription: {
                    planName: 'Trial',
                    planType: 'Trial',
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                    status: 'Active',
                },
            });

            // Respond with success and tokens
            return res.status(201).json({
                message: 'Company registered successfully',
                ...tokens,
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(400).json({ message: error.message });
            }
            return res.status(400).json({ message: 'Registration failed', error: 'Unknown error occurred' });
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        const { email, password, registration_number } = req.body;

        // Validate input data
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const tokens = await companyService.login(email, password, registration_number);
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
}
