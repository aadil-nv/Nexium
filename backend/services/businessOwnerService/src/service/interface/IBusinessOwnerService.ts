import {IPersonalDetailsDTO ,ICompanyDetailsDTO,IAddressDTO,IResponseDTO, IDocumentDTO ,ILeaveResonseDTO ,ILeaveTypesDTO} from '../../dto/businessOwnerDTO'


export default interface IBusinessOwnerService {
    setNewAccessToken(decoded: any): Promise<IResponseDTO>;
    addSubscription(subscriptionData: any): Promise<IResponseDTO>;
    getPersonalDetails(businessOwnerId:string):Promise<IPersonalDetailsDTO>
    getCompanyDetails(businessOwnerId:string):Promise<ICompanyDetailsDTO>
    getAddress(businessOwnerId:string):Promise<IAddressDTO>
    getDocuments(businessOwnerId:string):Promise<IDocumentDTO>
    updatePersonalDetails(businessOwnerId: string, data: any): Promise<IResponseDTO>;
    uploadImages(businessOwnerId: string, file: any): Promise<IResponseDTO>;
    uploadLogo(businessOwnerId: string, file: any): Promise<IResponseDTO>;
    updateAddress(businessOwnerId: string, data: any): Promise<IResponseDTO>;
    updateCompanyDetails(businessOwnerId: string, data: any): Promise<ICompanyDetailsDTO>;
    uploadDocuments(businessOwnerId: string, documentData:any ,documentType:any): Promise<IDocumentDTO>;
    addServiceRequest(businessOwnerId: string, data: any): Promise<IResponseDTO>;
    getAllServiceRequests(businessOwnerId: string): Promise<any[]>
    updateServiceRequest(serviceRequestId: string, data: any): Promise<IResponseDTO>;
    updateLastSeen(businessOwnerId: string): Promise<IResponseDTO>
    updateIsActive(businessOwnerId: string , isActive: boolean): Promise<IResponseDTO>
    getAllLeaveTypes(businessOwnerId: string): Promise<any[]>
    updateLeaveTypes( leaveTypeId: string,businessOwnerId: string, data: ILeaveTypesDTO ): Promise<ILeaveResonseDTO>

}
