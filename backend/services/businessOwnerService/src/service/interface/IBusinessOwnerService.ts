import {IPersonalDetailsDTO ,ICompanyDetailsDTO,IAddressDTO,IDocumentsDTO,IResponseDTO} from '../../dto/businessOwnerDTO'


export default interface IBusinessOwnerService {

    setNewAccessToken(decoded: any): Promise<string>;
    addSubscription(subscriptionData: any): Promise<any>;
    
    getPersonalDetails(businessOwnerId:string):Promise<IPersonalDetailsDTO>
    getCompanyDetails(businessOwnerId:string):Promise<ICompanyDetailsDTO>
    getAddress(businessOwnerId:string):Promise<IAddressDTO>
    getDocuments(businessOwnerId:string):Promise<IDocumentsDTO>
    updatePersonalDetails(businessOwnerId: string, data: any): Promise<IResponseDTO>;
    uploadImages(businessOwnerId: string, file: any): Promise<IResponseDTO>;
    uploadLogo(businessOwnerId: string, file: any): Promise<IResponseDTO>;

}
