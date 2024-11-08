import { Router } from "express";
import container from "config/inversify";
import IMangerController from "../controllers/interface/IManagerController"


const managerRouter = Router(); 

const managerController = container.get<IMangerController>("IMangerController");


managerRouter.post("/login", (req, res, next) => managerController.login(req, res, next));
