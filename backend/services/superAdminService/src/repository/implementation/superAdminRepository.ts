import { injectable,inject } from "inversify";
import ISuperAdminRepository from "../interface/ISuperAdminRepository";
import ServiceRequestModel from "../../models/serviceRequestModel";



@injectable()
export default class SuperAdminRepository implements ISuperAdminRepository {
    
    async getAllServiceRequest(): Promise<any> {
        try {
            const response = await ServiceRequestModel.find().populate('businessOwnerId');
            return response

        } catch (error) {
            console.error('Error fetching super admins:', error);
            throw new Error("Could not fetch super admins.");
            
        }
    }

async updateServiceRequestStatus(id: string, status: string): Promise<any> {
  try {
    const updatedServiceRequest = await ServiceRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true } 
    );

    if (!updatedServiceRequest) {
      console.error(`Service request with id ${id} not found.`);
      throw new Error(`Service request with id ${id} not found.`);
    }

    return updatedServiceRequest;
  } catch (error) {
    console.error('Error updating service request:', error);
    throw new Error("Could not update the service request.");
  }
}

}