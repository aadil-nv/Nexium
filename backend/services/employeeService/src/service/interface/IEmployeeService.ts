import { ISetNewAccessTokenDTO ,IGetProfileDTO} from "../../dto/IEmployeeDTO";


export default interface IEmployeeController {
    setNewAccessToken(refreshToken:string):Promise<ISetNewAccessTokenDTO>
    getProfile(employeeId: string): Promise<IGetProfileDTO>

}