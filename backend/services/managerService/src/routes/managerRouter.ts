import { Router } from "express";
import container from "../config/inversify";
import IManagerController from "../controllers/interface/IManagerController"
import authenticateToken from "../middlewares/tokenAuthenticate";
import managerModel from "models/managerModel";


const managerRouter = Router(); 

const managerController = container.get<IManagerController>("IManagerController");


managerRouter.get("/get-managers", (req, res) => managerController.getManagers(req , res));



export default managerRouter