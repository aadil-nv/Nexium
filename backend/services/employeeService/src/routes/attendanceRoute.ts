import Container  from "../config/inversify"
import { Router } from "express";
import IAttendanceController from "../controllers/interface/IAttendanceController"


const attendanceRouter = Router();


const attendanceController = Container.get<IAttendanceController>("IAttendanceController");


attendanceRouter.get("/fetch-attendance", attendanceController.fetchAttendance);

export default attendanceRouter
