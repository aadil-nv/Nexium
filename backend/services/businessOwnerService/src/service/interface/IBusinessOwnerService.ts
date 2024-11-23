import {IPersonalDetailsDTO ,ICompanyDetailsDTO,IAddressDTO,IDocumentsDTO,IResponseDTO} from '../../dto/businessOwnerDTO'


export default interface IBusinessOwnerService {

    registerBusinessOwner(businessOwnerData: string): Promise<any>;
    setNewAccessToken(decoded: any): Promise<string>;
    addSubscription(subscriptionData: any): Promise<any>;
    getPersonalDetails(refreshToken:string):Promise<IPersonalDetailsDTO>
    getCompanyDetails(refreshToken:string):Promise<ICompanyDetailsDTO>
    getAddress(refreshToken:string):Promise<IAddressDTO>
    getDocuments(refreshToken:string):Promise<IDocumentsDTO>
    updatePersonalDetails(refreshToken: string, data: any): Promise<IResponseDTO>;
    uploadImages(refreshToken: string, file: any): Promise<IResponseDTO>;

}
