import { Router, Request, Response } from "express";
import {BusinessOwnerController} from "../Controllers/implementation/businessOwnerController";

const businessOwnerRouter = Router();
const businessOwnerController = new BusinessOwnerController();

businessOwnerRouter.post("/add-hrmanagers",businessOwnerController.addHRManager);


export default businessOwnerRouter;