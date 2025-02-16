import { inject, injectable } from "inversify";
import ISubscriptionService from "../interface/ISubscriptionService";
import ISubscriptionRepository from "../../repository/interface/ISubscriptionRepository";
import IBusinessOwnerRepository from "../../repository/interface/IBusinessOwnerRepository"; // Adjust the import path
import { ISubscriptionDTO } from "../../dto/subscriptionDTO";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string);

@injectable()
export default class SubscriptionService implements ISubscriptionService {
    private _subscriptionRepository: ISubscriptionRepository;
    private _businessOwnerRepository: IBusinessOwnerRepository;

    constructor(
        @inject("ISubscriptionRepository") subscriptionRepository: ISubscriptionRepository,
        @inject("IBusinessOwnerRepository") businessOwnerRepository: IBusinessOwnerRepository
    ) {
        this._subscriptionRepository = subscriptionRepository;
        this._businessOwnerRepository = businessOwnerRepository;
    }



    async getSubscription(businessOwnerId: string): Promise<ISubscriptionDTO> {
        try {
            // Convert businessOwnerId (string) to ObjectId
            const objectId = new mongoose.Types.ObjectId(businessOwnerId);

    
            // Use the businessOwnerRepository to fetch business owner data
            const businessOwnerData = await this._businessOwnerRepository.findOne({ _id: objectId });
           
    
            const subscriptionId = businessOwnerData?.subscription?.subscriptionId;
            if (!subscriptionId) {
                throw new Error("Subscription not found");
            }
    
            // Get the subscription details
            const subscription = await this._subscriptionRepository.getSubscription(subscriptionId.toString()); // Ensure subscriptionId is a string
          
    
            return {
                _id: subscription._id,
                planName: subscription.planName,
                description: subscription.description,
                price: subscription.price,
                planType: subscription.planType,
                durationInMonths: subscription.durationInMonths,
                features: subscription.features,
                isActive: subscription.isActive,
                employeeCount:subscription.employeeCount,
                 managerCount: subscription.managerCount,
                projectCount:subscription.projectCount,
                 serviceRequestCount: subscription.serviceRequestCount
            };
        } catch (error) {
            console.error("Error fetching subscription:", error);
            throw new Error("Could not fetch subscription.");
        }
    }
    

    async getAllSubscriptions(): Promise<any> {
        try {
            const subscriptions = await this._subscriptionRepository.getAllSubscriptions();
            console.log("All Subscriptions:", subscriptions);
            if (!subscriptions) {
                throw new Error("Subscriptions not found");
            }

            return { subscriptions };
        } catch (error) {
            console.error("Error fetching all subscriptions:", error);
            throw new Error("Could not fetch subscriptions.");
        }
    }

    async getInvoices(businessOwnerId: string): Promise<any> {
        
        try {
            // Convert businessOwnerId (string) to ObjectId
            const objectId = new mongoose.Types.ObjectId(businessOwnerId);
    
            // Fetch business owner data from the repository
            const businessOwnerData = await this._businessOwnerRepository.findOne({ _id: objectId });

            // Ensure business owner data exists and extract subscription and customer details
            if (!businessOwnerData || !businessOwnerData?.subscription?.customerId) {
                throw new Error('Business owner data or customer ID not found');
            }

            const customerId = businessOwnerData?.subscription?.customerId;
            console.log("customerId>>>>>>>>>>>>>>", customerId);

            const customer = await stripe.customers.retrieve(customerId);

            console.log(`customer>>>>>>>>>>>>>>`.bgWhite, customer);
            
            

            // Fetch invoices from Stripe for the customer
            const invoices = await stripe.invoices.list({
                customer: customerId,
                limit: 10, 
            });
            console.log(`"invoices>>>>>>>>>>>>>>"`.bgMagenta, invoices);
            

            // Return the invoices to the caller
            return invoices.data;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            throw new Error('Could not fetch invoices.');
        }
    }
}
