import { Response } from "express";
import { inject, injectable } from "inversify";
import IBusinessOwnerController from "../interface/IBusinessOwnerController";
import IBusinessOwnerService from "../../service/interface/IBusinessOwnerService";
import { CustomRequest } from "../../middlewares/authMiddleware";
import { HttpStatusCode } from "./../../utils/enums";

@injectable()
export default class BusinessOwnerController implements IBusinessOwnerController {
  constructor(@inject("IBusinessOwnerService") private _businessOwnerService: IBusinessOwnerService) {}


  private handleResponse(res: Response, status: number, success: boolean, message: string, data?: any) {
    if (success) {
      return res.status(status).json({ success, data });
    } else {
      return res.status(status).json({ success, message });
    }
  }

  private getBusinessOwnerId(req: CustomRequest) {
    return req.user?.businessOwnerData?._id;
  }

  async setNewAccessToken(req: CustomRequest, res: Response): Promise<Response> {
    const refreshToken = req.cookies.refreshToken;
    try {
      const newAccessToken = await this._businessOwnerService.setNewAccessToken(refreshToken);
      if (!newAccessToken) return this.handleResponse(res, 401, false, 'Failed to generate new access token.');
      res.cookie('accessToken', newAccessToken.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
        sameSite: 'strict',
      });

      return this.handleResponse(res, 200, true, 'Access token generated', { accessToken: newAccessToken.accessToken });
    } catch {
      return this.handleResponse(res, 500, false, 'Failed to generate new access token.');
    }
  }

  async logout(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Logout successful');
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Logout failed');
    }
  }

  async getPersonalDetails(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getPersonalDetails(businessOwnerId);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Personal details fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve personal details');
    }
  }

  async getCompanyDetails(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getCompanyDetails(businessOwnerId);
      return this.handleResponse(res,HttpStatusCode.OK, true, 'Company details fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve company details');
    }
  }

  async getAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getAddress(businessOwnerId);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Address fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve address');
    }
  }

  async getDocuments(req: CustomRequest, res: Response): Promise<Response> {


    
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getDocuments(businessOwnerId);

      
      if(!result) return this.handleResponse(res, HttpStatusCode.OK, false, 'Documents not found.');
      return res.status(200).json({ result });
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to retrieve documents');
    }
  }

  async updatePersonalDetails(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updatePersonalDetails(businessOwnerId, data);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Personal details updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update personal details');
    }
  }

  async updateCompanyDetails(req: CustomRequest, res: Response): Promise<Response> {
    
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res, 400, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updateCompanyDetails(businessOwnerId, data);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Company details updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update company details');
    }
  }

  async updateAddress(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updateAddress(businessOwnerId, data);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Address updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update address');
    }
  }

  async uploadImages(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      if (!req.file) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'No file uploaded');
      const result = await this._businessOwnerService.uploadImages(businessOwnerId, req.file);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Image uploaded', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to upload image');
    }
  }

  async uploadLogo(req: CustomRequest, res: Response): Promise<Response> {
    console.log(`uploadLogo: ${JSON.stringify(req.file)}`);
    
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      if (!req.file) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'No file uploaded');
      const result = await this._businessOwnerService.uploadLogo(businessOwnerId, req.file);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Logo uploaded', result.data);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to upload logo');
    }
  }

  async uploadDocuments(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
  
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      if (!req.file ) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'File or document type missing.');
  
      const result = await this._businessOwnerService.uploadDocuments(businessOwnerId, req.file, "companyCertificate");

      
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Document uploaded successfully', result);
    } catch (error) {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to upload documents');
    }
  }

  async addServiceRequest(req: CustomRequest, res: Response): Promise<Response> {
    
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      
      const result = await this._businessOwnerService.addServiceRequest(businessOwnerId, data);
      
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Service request added', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to add service request');
    }
  }

  async getAllServiceRequests(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getAllServiceRequests(businessOwnerId);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Service requests fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to fetch service requests');
    }
  }

  async updateServiceRequest(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const serviceRequestId = req.params.id;
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res,HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updateServiceRequest(serviceRequestId, data);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Service request updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update service request');
    }
  }

  async updateIsActive(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res,HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updateIsActive(businessOwnerId, false);
      return this.handleResponse(res,HttpStatusCode.OK, true, 'Service request updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update service request');
    }
  }

  async updateLastSeen(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.updateLastSeen(businessOwnerId);
      return this.handleResponse(res,HttpStatusCode.OK, true, 'Service request updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update service request');
    }
  }


  async getAllLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getAllLeaveTypes(businessOwnerId);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Leave types fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to fetch leave types');
    }
  }

   
  async updateLeaveTypes(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const leaveTypeId = req.params.id;
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');    
      const result = await this._businessOwnerService.updateLeaveTypes(leaveTypeId,businessOwnerId, req.body);
      return this.handleResponse(res,HttpStatusCode.OK, true, 'Leave types updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update leave types');
    }
  }
  

  async getAllPayrollCriteria(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      if (!businessOwnerId) return this.handleResponse(res,HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');
      const result = await this._businessOwnerService.getAllPayrollCriteria(businessOwnerId);      
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Payroll criteria fetched', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to fetch payroll criteria');
    }
  }
  async updatePayrollCriteria(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const payrollCriteriaId = req.params.id;
      if (!businessOwnerId) return this.handleResponse(res,HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');    
      const result = await this._businessOwnerService.updatePayrollCriteria(req.body,payrollCriteriaId,businessOwnerId);
      return this.handleResponse(res,HttpStatusCode.OK, true, 'Payroll criteria updated', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to update payroll criteria');
    }
  }
  async deleteIncentive(req: CustomRequest, res: Response): Promise<Response> {
    try {
      const businessOwnerId = this.getBusinessOwnerId(req);
      const incentiveId = req.params.id;
      const data = req.body;
      if (!businessOwnerId) return this.handleResponse(res, HttpStatusCode.BAD_REQUEST, false, 'Business Owner ID not found.');    
      const result = await this._businessOwnerService.deleteIncentive(incentiveId,data ,businessOwnerId);
      return this.handleResponse(res, HttpStatusCode.OK, true, 'Incentive deleted', result);
    } catch {
      return this.handleResponse(res, HttpStatusCode.INTERNAL_SERVER_ERROR, false, 'Failed to delete incentive');
    }
  }
  
}
