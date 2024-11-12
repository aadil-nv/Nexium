// import {Request, Response} from "express";
// import IManagerController from "../interface/IManagerController";
// import IManagerService from "../../service/interfaces/IManagerService";
// import { inject, injectable } from "inversify";


// @injectable()

// export default class ManagerController implements IManagerController {
//     private managerService: IManagerService;

//     constructor(@inject("IManagerService") managerService: IManagerService) {
//         this.managerService = managerService;
//     }

//     async managerLogin(req: Request, res: Response): Promise<Response> {
//        try {

//         const result = await this.managerService.login(req.body.email,req.body.password)
//         return res.status(200).json(result);
        
//        } catch (error) {
//         console.log(error)
//         return res.status(500).json({message: error || "Internal Server Error"})
//        }
//     }
// }
