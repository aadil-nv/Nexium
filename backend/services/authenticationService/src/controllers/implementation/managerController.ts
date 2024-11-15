import {Request, Response} from "express";
import IManagerController from "../interface/IManagerController";
import IManagerService from "../../service/interfaces/IManagerService";
import { inject, injectable } from "inversify";


@injectable()

export default class ManagerController implements IManagerController {
    private managerService: IManagerService;

    constructor(@inject("IManagerService") managerService: IManagerService) {
        this.managerService = managerService;
    }

    async managerLogin(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.managerService.managerLogin(req.body.email, req.body.password);
            console.log("Login result:------->", result);
            
            if(result.accessToken && result.refreshToken) {
                res.cookie('accessToken', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'lax',
                });

                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    sameSite: 'lax',    
                })
                console.log("Tocken setted successfully=====>111", );
            }
            console.log("Tocken setted successfully=====>22222", );
            return res.status(200).json({ message: "Login successful", data: result });
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            return res.status(400).json({ message: errorMessage, error: true });
        }
    }
    
    
    
    
}
