import { Request, Response } from "express";
export default interface IEmployeeController {
    getProfile(req:Request, res:Response): Promise<any>;
}