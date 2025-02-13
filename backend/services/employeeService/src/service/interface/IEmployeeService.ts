import { ISetNewAccessTokenDTO ,IGetProfileDTO, IEmployeeResponseDTO, IGetAddressDTO, IGetEmployeeProfessionalDTO, IGetDocumentDTO, IGetCredentailsDTO} from "../../dto/IEmployeeDTO";


export default interface IEmployeeController {
    setNewAccessToken(refreshToken:string ):Promise<ISetNewAccessTokenDTO>
    getProfile(employeeId: string ,businessOwnerId: string): Promise<IGetProfileDTO>
    getPersonalInfo(employeeId: string,businessOwnerId:string): Promise<IGetProfileDTO>
    updateProfile(employeeId: string, data: any,businessOwnerId:string): Promise<IEmployeeResponseDTO>
    updateProfilePicture(employeeId: string, file: Express.Multer.File,businessOwnerId:string): Promise<IEmployeeResponseDTO>
    getAddress(employeeId: string,businessOwnerId:string): Promise<IGetAddressDTO>
    updateAddress(employeeId: string, data: any,businessOwnerId:string): Promise<IEmployeeResponseDTO>
    getEmployeeProfessionalInfo(employeeId: string,businessOwnerId:string): Promise<IGetEmployeeProfessionalDTO>
    getDocuments(employeeId: string,businessOwnerId:string): Promise<IGetDocumentDTO>
    uploadDocuments(employeeId: string, file: Express.Multer.File, fileType: "resume",businessOwnerId:string): Promise<IGetDocumentDTO>
    getEmployeeCredentials(employeeId: string,businessOwnerId:string): Promise<IGetCredentailsDTO>
    updateIsActive(employeeId: string, isActive: boolean,businessOwnerId:string): Promise<IEmployeeResponseDTO>
}