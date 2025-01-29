import { ISetNewAccessTokenDTO ,IGetProfileDTO, IEmployeeResponseDTO, IGetAddressDTO, IGetEmployeeProfessionalDTO, IGetDocumentDTO, IGetCredentailsDTO} from "../../dto/IEmployeeDTO";


export default interface IEmployeeController {
    setNewAccessToken(refreshToken:string):Promise<ISetNewAccessTokenDTO>
    getProfile(employeeId: string): Promise<IGetProfileDTO>
    getPersonalInfo(employeeId: string): Promise<IGetProfileDTO>
    updateProfile(employeeId: string, data: any): Promise<IEmployeeResponseDTO>
    updateProfilePicture(employeeId: string, file: Express.Multer.File): Promise<IEmployeeResponseDTO>
    getAddress(employeeId: string): Promise<IGetAddressDTO>
    updateAddress(employeeId: string, data: any): Promise<IEmployeeResponseDTO>
    getEmployeeProfessionalInfo(employeeId: string): Promise<IGetEmployeeProfessionalDTO>
    getDocuments(employeeId: string): Promise<IGetDocumentDTO>
    uploadDocuments(employeeId: string, file: Express.Multer.File, fileType: "resume"): Promise<IGetDocumentDTO>
    getEmployeeCredentials(employeeId: string): Promise<IGetCredentailsDTO>
}