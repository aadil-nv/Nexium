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

import DepartmentController from "../controllers/implementation/departmentController";
import DepartmentRepository from "../repository/implementation/departmentRepository";
import DepartmentService from "../service/implementation/departmentService";

import IDepartmentController from "../controllers/interface/IDepartmentController";
import IDepartmentService from "../service/interface/IDepartmentService";
import IDepartmentRepository from "../repository/interface/IDepartmentRepository";

import DepartmentModel from "../models/departmentModel";
import IDepartment from "../entities/departmentEntities";

import ITaskController from "../controllers/interface/ITaskController";
import TaskController from "../controllers/implementation/taskController";
import ITaskService from "../service/interface/ITaskService";
import TaskService from "../service/implementation/taskService";
import ITaskRepository from "../repository/interface/ITaskRepository";
import TaskRepository from "../repository/implementation/taskRepository";

import TaskModel from "../models/taskModel";
import {ITask} from "../entities/taskEntities";


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


container.bind<IDepartmentController>("IDepartmentController").to(DepartmentController);
container.bind<IDepartmentService>("IDepartmentService").to(DepartmentService);
container.bind<IDepartmentRepository>("IDepartmentRepository").to(DepartmentRepository);


container.bind<ITaskController>("ITaskController").to(TaskController);
container.bind<ITaskService>("ITaskService").to(TaskService);
container.bind<ITaskRepository>("ITaskRepository").to(TaskRepository);




container.bind<mongoose.Model<IPayroll>>("IPayroll").toConstantValue(payrollModel);
container.bind<mongoose.Model<IEmployee>>("IEmployee").toConstantValue(EmployeeModel);
container.bind<mongoose.Model<IEmployeeAttendance>>("IEmployeeAttendance").toConstantValue(AttendanceModel);
container.bind<mongoose.Model<IDepartment>>("IDepartment").toConstantValue(DepartmentModel);
container.bind<mongoose.Model<ITask>>("ITask").toConstantValue(TaskModel);






export default container