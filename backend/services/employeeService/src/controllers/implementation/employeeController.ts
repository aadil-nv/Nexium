import { injectable ,inject } from "inversify"; 
import { Request, Response } from "express";
import  IEmployeeService  from "../../service/interface/IEmployeeService";
import IEmployeeController from "../interface/IEmployeeController";
import { CustomAction } from "aws-sdk/clients/networkfirewall";
import { CustomRequest } from "../../middlewares/tokenAuth";
import connectDB from "../../config/connectDB";




@injectable()
export default class EmployeeController implements IEmployeeController {
    constructor(@inject("IEmployeeService") 
    private _employeeService: IEmployeeService) {}

    async setNewAccessToken(req: Request, res: Response): Promise<Response> {
            
        try {
            const  refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: "Access denied. No token provided" });
            }

            const result = await this._employeeService.setNewAccessToken(refreshToken);
            if (!result.accessToken) {
                console.error("Failed to generate a new access token.");
                return res.status(401).json({ message: 'Failed to generate new access token.' });
              }
          
          
              res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, // 1 hour
                sameSite: 'strict',
              });
              

              await connectDB(result.businessOwnerId)



            return res.status(200).json({ message: "Access token set successfully" ,success:result.success  });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
            
        }
    }

    async logout(req: Request, res: Response): Promise<Response> {
        console.log("hitted logout-----------------------------------");
        
        try {
          res.clearCookie('refreshToken');
          res.clearCookie('accessToken');
          return res.status(200).json({ message: 'Logged out successfully.' });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to logout.' });
        }
      }

    async getProfile(req: CustomRequest, res: Response): Promise<Response> {
        console.log("hitted get profile-----------------------------------contrtoler");
        
        try {
            const employeeId = req.user?.employeeData?._id;


            console.log("employee id from controller========>", employeeId);
            
            if(!employeeId) return res.status(401).json({ message: "Access denied. No token provided" });

            const employee = await this._employeeService.getProfile(employeeId);

            console.log(`employee from conreoler`.bgRed,employee);
            
            return res.status(200).json(employee);
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
            
        }
    }  



}