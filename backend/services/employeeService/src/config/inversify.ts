import mongoose from "mongoose";
import { Container } from "inversify";

import IAttendanceController from "../controllers/interface/IAttendanceController";
import AttendenceController from "../controllers/implementation/attendenceController";
import IAttendanceService from "../service/interface/IAttendanceService";
import AttendanceService from "../service/implementation/attendanceService";
import IAttendanceRepository from "../repository/interface/IAttendanceRepository";
import AttendanceRepository from "../repository/implementation/attendanceRepository";

import IEmployeeController from "../controllers/interface/IEmployeeController";
import EmployeeController from "../controllers/implementation/employeeController";
import IEmployeeService from "../service/interface/IEmployeeService";
import EmployeeService from "../service/implementation/employeeService";
import IEmployeeRepository from "../repository/interface/IEmployeeRepository";
import EmployeeRepository from "../repository/implementation/employeeRepository";

import EmployeeModel from "../models/employeeModel";
import AttendanceModel from "../models/attendanceModel";

import IEmployee from "../entities/employeeEntities";
import { IEmployeeAttendance } from "../entities/attendanceEntities";

import IPayrollController from "../controllers/interface/IPayrollController";
import PayrollController from "../controllers/implementation/payrollController";
import IPayrollService from "../service/interface/IPayrollService";
import PayrollService from "../service/implementation/payrollService";
import IPayrollRepository from "../repository/interface/IPayrollRepository";
import PayrollRepository from "../repository/implementation/payrollRepository";
import { IPayroll } from "../entities/payrollEntities"; 
import payrollModel from "../models/payrollModel";



const container = new Container();

container.bind<IAttendanceController>("IAttendanceController").to(AttendenceController);
container.bind<IAttendanceService>("IAttendanceService").to(AttendanceService);
container.bind<IAttendanceRepository>("IAttendanceRepository").to(AttendanceRepository);


container.bind<IEmployeeController>("IEmployeeController").to(EmployeeController);
container.bind<IEmployeeService>("IEmployeeService").to(EmployeeService);
container.bind<IEmployeeRepository>("IEmployeeRepository").to(EmployeeRepository);


container.bind<IPayrollController>("IPayrollController").to(PayrollController);
container.bind<IPayrollService>("IPayrollService").to(PayrollService);
container.bind<IPayrollRepository>("IPayrollRepository").to(PayrollRepository);


container.bind<mongoose.Model<IPayroll>>("IPayroll").toConstantValue(payrollModel);
container.bind<mongoose.Model<IEmployee>>("IEmployee").toConstantValue(EmployeeModel);
container.bind<mongoose.Model<IEmployeeAttendance>>("IEmployeeAttendance").toConstantValue(AttendanceModel);




export default container