import Container  from "../config/inversify"
import { Router } from "express";
import IAttendanceController from "../controllers/interface/IAttendanceController"
import tokenAutharaise from "../middlewares/tokenAuth"


const attendanceRouter = Router();


const attendanceController = Container.get<IAttendanceController>("IAttendanceController");


attendanceRouter.get("/get-attendances",tokenAutharaise,(req, res)=> attendanceController.fetchAttendance(req, res));
attendanceRouter.post("/mark-checkin",tokenAutharaise,(req, res)=> attendanceController.markCheckin(req, res));
attendanceRouter.post("/mark-checkout",tokenAutharaise,(req, res)=> attendanceController.markCheckout(req, res));


export default attendanceRouter
