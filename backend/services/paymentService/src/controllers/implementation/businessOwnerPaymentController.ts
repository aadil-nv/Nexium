import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import IBusinessOwnerPaymentController from "../interface/IBusinessOwnerPaymentController";
import IBusinessOwnerPaymentService from "../../service/interface/IBusinessOwnerPaymentService";
import { CustomRequest } from "../../middlewares/authMiddleware";

@injectable()
export default class BusinessOwnerPaymentController
  implements IBusinessOwnerPaymentController
{
  constructor(
    @inject("IBusinessOwnerPaymentService")
    private _businessOwnerPaymentService: IBusinessOwnerPaymentService
  ) {}

  async getAllPayments(req: Request, res: Response): Promise<Response> {
    try {
      const payments = await this._businessOwnerPaymentService.getAllPayments();
      if (!payments) {
        return res.status(404).json({ error: "No payments found" });
      }
      return res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async upgradePlan(req: CustomRequest, res: Response): Promise<Response> {

    console.log("Inside upgradePlan controller====================================");
    
    // Step 1: Extract the plan from request body
    const { plan } = req.body;
    console.log('Received plan:', plan); // Debugging step
  
    // Step 2: Extract businessOwnerId and email from the token
    const businessOwnerId = req.user?.businessOwnerData?._id;
    const  email = req.user?.businessOwnerData?.personalDetails?.email
  
    console.log('Business Owner ID:', businessOwnerId); // Debugging step
    console.log('Email:', email); // Debugging step


    
  
    // Step 3: Check for missing values
    if (!businessOwnerId || !email) {
      console.log('Missing businessOwnerId or email'); // Debugging step
      return res.status(400).json({ message: "Business owner ID or email is missing." });
    }
  
    try {
      // Step 4: Call the service to upgrade the plan
      const result = await this._businessOwnerPaymentService.upgradePlan(businessOwnerId, email, plan);
      console.log('Result from upgradePlan service:', result); // Debugging step
  
      // Step 5: Handle the result based on the plan
      const response = result.planName === 'Trial'
        ? { message: result.message, success: result.success, role: result.role, planName: result.planName }
        : { sessionId: result.session.id, success: result.success, planName: result.planName };
  
      console.log('Response to be sent:', response); // Debugging step
  
      return res.status(200).json(response);
    } catch (error) {
      console.error('Error creating checkout session:', error); // Debugging step
      return res.status(500).json({ message: 'Failed to create checkout session', error });
    }
  }

  async findBusinessOwner(businessOwnerId: string, res: Response): Promise<void> {
    try {
     console.log("Inside findBusinessOwner controller====================================");
     
      const businessOwner = await this._businessOwnerPaymentService.findBusinessOwner(businessOwnerId);
      res.json(businessOwner);
    } catch (error) {
      res.status(500).json({ message: "Error fetching business owner" });
    }
  }
  
  
}
