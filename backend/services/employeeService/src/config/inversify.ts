import { Container } from "inversify";

import IAttendanceController from "../controllers/interface/IAttendanceController";
import IAttendanceService from "../service/interface/IAttendanceService";
import IAttendanceRepository from "../repository/interface/IAttendanceRepository";

import AttendenceController from "../controllers/implementation/attendenceController";
import AttendanceService from "../service/implementation/attendanceService";
import AttendanceRepository from "../repository/implementation/attendanceRepository";


const container = new Container();

container.bind<IAttendanceController>("IAttendanceController").to(AttendenceController);
container.bind<IAttendanceService>("IAttendanceService").to(AttendanceService);
container.bind<IAttendanceRepository>("IAttendanceRepository").to(AttendanceRepository);


export default container