export interface ServiceRequestsDTO {
    serviceRequests: {
      _id: string;
      businessOwnerId: string;
      companyName: string;
      companyLogo: string;
      serviceName: string;
      requestReason: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    }[];
  }
  