import Container  from "../config/inversify"
import { Router } from "express";
import IAttendanceController from "../controllers/interface/IAttendanceController"


const attendanceRouter = Router();


const attendanceController = Container.get<IAttendanceController>("IAttendanceController");


attendanceRouter.get("/fetch-attendance",(req, res)=> attendanceController.fetchAttendance(req, res));

export default attendanceRouter
