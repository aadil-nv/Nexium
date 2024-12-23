import ISuperAdminService from "../../service/interface/ISuperAdminService";
import { inject, injectable } from "inversify";
import { generateAccessToken, verifyRefreshToken } from "../../utils/jwt";
import ISuperAdminRepository from "../../repository/interface/ISuperAdminRepository";
import { ServiceRequestsDTO  } from "../../dto/superAdminDTO";

@injectable()
export default class SuperAdminService implements ISuperAdminService {
  private _superAdminRepository: ISuperAdminRepository;

  constructor(@inject("ISuperAdminRepository") superAdminRepository: ISuperAdminRepository) {
    this._superAdminRepository = superAdminRepository;
  }

  async setNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      if (!decoded) {
        throw new Error("Invalid or expired refresh token");
      }

      const newAccessToken = generateAccessToken({ decoded });

      if (!newAccessToken) {
        throw new Error("Failed to generate a new access token");
      }

      return newAccessToken;
    } catch (error) {
      console.log("Error generating new access token:", error);    
      throw new Error("Invalid or expired refresh token");
    }
  }


  async getAllServiceRequest(): Promise<ServiceRequestsDTO> {
    try {
      const response = await this._superAdminRepository.getAllServiceRequest();
  
      if (!response) throw new Error("Error while fetching service requests");
  
      const serviceRequests: ServiceRequestsDTO = {
        serviceRequests: response.map((request: any) => ({
          _id: request._id,
          businessOwnerId: request.businessOwnerId,
          companyName: request.companyName,
          companyLogo: request.companyLogo ? `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${request.companyLogo}` : request.companyLogo,
          serviceName: request.serviceName,
          requestReason: request.requestReason,
          status: request.status,
          createdAt: request.createdAt,
          updatedAt: request.updatedAt,
       
        }))
      };
  
      return serviceRequests;
    } catch (error) {
      throw new Error("Error while fetching service requests");
    }
  }
  
  async updateServiceRequestStatus(id: string, status: string): Promise<any> {
    try {
      const response = await this._superAdminRepository.updateServiceRequestStatus(id, status);
  
      if (!response) throw new Error("Error while updating service request status");
  
      return response;
    } catch (error) {
      throw new Error("Error while updating service request status");
    }
  }
}
