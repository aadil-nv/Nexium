import { injectable,inject } from "inversify";
import IEmployeeRepository  from "../../repository/interface/IEmployeeRepository";
import IEmployeeService from "../interface/IEmployeeService";
import { verifyRefreshToken,generateAccessToken } from "../../utils/jwt";
import { IGetProfileDTO, ISetNewAccessTokenDTO } from "../../dto/IEmployeeDTO";



@injectable()
export default class EmployeeService implements IEmployeeService {
    constructor(@inject("IEmployeeRepository")
     private _employeeRepository: IEmployeeRepository) {}
    
    async  setNewAccessToken(refreshToken:string):Promise<ISetNewAccessTokenDTO> {

        console.log("refresh token in manager service", refreshToken);
    
    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log("decoded==================>", decoded);
      
      const employeeData = decoded?.employeeData;

      if (!decoded || !employeeData) {
        throw new Error("Invalid or expired refresh token");
      }

      const accessToken = generateAccessToken({ employeeData });
      return {
        accessToken,
        message: "Access token set successfully from service ",
        success: true,
        businessOwnerId: employeeData.businessOwnerId
      }


    } catch (error:any) {
      throw new Error("Error generating new access token: " + error.message);
    }
    } 

    async getProfile(employeeId: string): Promise<IGetProfileDTO> {
        console.log("hitted get profile-----------------------------------service ", employeeId);
        
        try {
          const employee = await this._employeeRepository.getProfile( employeeId);

                console.log("data from service", employee);
                

          if (!employee) {
            throw new Error("Employee not found");
          }
          return {
   
            employeeName: employee?.personalDetails.employeeName,
            email: employee?.personalDetails.email,
            phone: employee?.personalDetails.phone,
            profilePicture: employee?.personalDetails.profilePicture,
            message: "Profile fetched successfully",
          }
        } catch (error:any) {
            throw new Error("Error generating new access token: " + error.message);
          
        }
      }
}