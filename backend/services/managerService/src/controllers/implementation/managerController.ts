import {Request, Response} from 'express';  
import  IManagerController  from '../interface/IManagerController';
import  IManagerService from '../../service/interface/IManagerService';
import ManagerService from '../../service/implementation/managerService';


export class ManagerControllerImpl implements ManagerController {
    private managerService: IManagerService;

    constructor(managerService: IManagerService) {
        this.managerService = managerService;
    }

    async createManager(req: Request, res: Response): Promise<void> {
        try {
            const {} = req.body;
            await this.managerService.createManager(manager);
            res.status(201).json({ message: 'Manager created successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create manager' });
        }
    }
}