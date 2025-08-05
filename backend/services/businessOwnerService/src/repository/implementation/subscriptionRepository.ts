import { inject, injectable } from "inversify";
import mongoose from "mongoose";
import ISubscriptionRepository from "../interface/ISubscriptionRepository";
import ISubscription from "../../entities/subscriptionEntity";
import BaseRepository from "./baseRepository";
import businessOwnerModel from "../../models/businessOwnerModel";
import serviceRequestModel from "../../models/serviceRequestModel";
import EmployeeModel from "../../models/employeeModel"
import ManagerModel from "../../models/managerModel"


@injectable()
export default class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository {
  constructor(
    @inject("subscriptionModel") private _subscriptionModel: mongoose.Model<ISubscription>
  ) {
    super(_subscriptionModel);
  }
  async getSubscription(subscriptionId: string): Promise<ISubscription> {
    try {
      const subscription = await this._subscriptionModel.findOne({ _id: subscriptionId });

      if (!subscription) {
        throw new Error("Subscription not found");
      }
      return subscription;

    } catch (error) {
      console.error("Error adding subscription:", error);
      throw new Error("Could not add subscription.");

    }
  }

  async getAllSubscriptions(): Promise<ISubscription[]> {
    try {
      const subscriptions = await this._subscriptionModel.find();
      return subscriptions;
    } catch (error) {
      console.error("Error adding subscription:", error);
      throw new Error("Could not add subscription.");
    }
  }

  async checkSubscriptionService(businessOwnerId: string): Promise<boolean> {
    try {
      const businessOwnerData = await businessOwnerModel
        .findOne({ _id: businessOwnerId })
        .populate<{ subscription: { subscriptionId: ISubscription } }>("subscription.subscriptionId");

      if (!businessOwnerData) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }

      const subscription = businessOwnerData.subscription?.subscriptionId as ISubscription;

      if (!subscription) {
        throw new Error(`Subscription not found for business owner: ${businessOwnerId}`);
      }

      const serviceRequestCount = await serviceRequestModel.countDocuments({ businessOwnerId });

      const allowedServiceRequests = subscription.serviceRequestCount ?? null;

      if (allowedServiceRequests !== null && serviceRequestCount >= allowedServiceRequests) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking subscription service:", error);
      throw new Error("Failed to check subscription service.");
    }
  }

  async checkSubscriptionEmployee(businessOwnerId: string): Promise<boolean> {
    try {
      const businessOwnerData = await businessOwnerModel
        .findOne({ _id: businessOwnerId })
        .populate<{ subscription: { subscriptionId: ISubscription } }>("subscription.subscriptionId");

      if (!businessOwnerData) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }

      const subscription = businessOwnerData.subscription?.subscriptionId as ISubscription;

      if (!subscription) {
        throw new Error(`Subscription not found for business owner: ${businessOwnerId}`);
      }

      const employeeCount = await EmployeeModel.countDocuments({ businessOwnerId });


      const allowedEmployees = subscription.serviceRequestCount ?? null;

      if (allowedEmployees !== null && employeeCount >= allowedEmployees) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking subscription service:", error);
      throw new Error("Failed to check subscription service.");
    }
  }
  
  async checkSubscriptionManager(businessOwnerId: string): Promise<boolean> {
    try {
      const businessOwnerData = await businessOwnerModel
        .findOne({ _id: businessOwnerId })
        .populate<{ subscription: { subscriptionId: ISubscription } }>("subscription.subscriptionId");

      if (!businessOwnerData) {
        throw new Error(`No business owner found with ID: ${businessOwnerId}`);
      }

      const subscription = businessOwnerData.subscription?.subscriptionId as ISubscription;

      if (!subscription) {
        throw new Error(`Subscription not found for business owner: ${businessOwnerId}`);
      }

      const managerCount = await ManagerModel.countDocuments({ businessOwnerId });


      const allowedEmployees = subscription.serviceRequestCount ?? null;

      if (allowedEmployees !== null && managerCount >= allowedEmployees) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking subscription service:", error);
      throw new Error("Failed to check subscription service.");
    }
  }

}

