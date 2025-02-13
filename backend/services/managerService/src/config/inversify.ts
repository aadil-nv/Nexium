import { Container } from "inversify";

// Import interfaces and implementations
import IManagerRepository from "../repository/interface/IManagerRepository";
import ManagerRepository from "../repository/implementation/managerRepository";  // Ensure correct import
import IManagerService from "../service/interface/IManagerService";
import ManagerService from "../service/implementation/managerService";  // Ensure correct import
import IManagerController from "../controllers/interface/IManagerController";
import ManagerController from "../controllers/implementation/managerController";  // Ensure correct import
import ManagerModel from "../models/managerModel";

import IDepartmentController from "../controllers/interface/IDepartmentController";
import IDepartmentService from "../service/interface/IDepartmentService";
import IDepartmentRepository from "../repository/interface/IDepartmentRepository";
import DepartmentRepository from "../repository/implementation/departmentRepository";  // Ensure correct import
import DepartmentService from "../service/implementation/departmentService";  // Ensure correct import
import DepartmentController from "../controllers/implementation/departmentController";  // Ensure correct import
import DepartmentModel from "../models/departmentModel";


import IEmployeeController from "../controllers/interface/IEmployeeController";
import IEmployeeRepository from "../repository/interface/IEmployeeRepository";
import IEmployeeService from "../service/interface/IEmployeeService";
import EmployeeRepository from "../repository/implementation/employeeRepository";  // Ensure correct import
import EmployeeService from "../service/implementation/employeeService";  // Ensure correct import
import EmployeeController from "../controllers/implementation/employeeController";  // Ensure correct import
import  EmployeeModel  from "../models/employeeModel";



import ILeaveController from "../controllers/interface/ILeaveController";
import ILeaveService from "../service/interface/ILeaveService";
import ILeaveRepository from "../repository/interface/ILeaveRepository";
import LeaveRepository from "../repository/implementation/leaveRepository";  // Ensure correct import
import LeaveService from "../service/implementation/leaveService";  // Ensure correct import
import LeaveController from "../controllers/implementation/leaveController";  // Ensure correct import
import EmployeeAttendance from "../models/attendanceModel";

import IDashboardController from "../controllers/interface/IDashboardController";
import IDashboardService from "../service/interface/IDashboardService";
import DashboardController from "../controllers/implementation/dashboardController";
import DashboardService from "../service/implementation/dashboardService";

import IPayrollController from "../controllers/interface/IPayrollController";
import IPayrollService from "../service/interface/IPayrollService";
import IPayrollRepository from "../repository/interface/IPayrollRepository";
import PayrollController from "../controllers/implementation/payrollController";
import PayrollService from "../service/implementation/payrollService";
import PayrollRepository from "../repository/implementation/payrollRepository";

import PayrollCriteriaModel from "../models/payrollCriteriaModel";
import { IPayrollCriteria } from "../entities/payrollCriteriaEntities";

import EmployeeLeaveModel from "../models/employeeLeaveModel";
import {IEmployeeLeave} from "../entities/employeeLeaveEntities";

import AppliedLeaveModel from "../models/appliedLeaveModel";
import {IAppliedLeave} from "../entities/appliedLeaveEntities"

import ProjectController from "../controllers/implementation/projectController";
import ProjectService from "../service/implementation/projectService";
import ProjectRepository from "../repository/implementation/projectRepository";

import IProjectService from "../service/interface/IProjectService";
import IProjectController from "../controllers/interface/IProjectController";
import IProjectRepository from "../repository/interface/IProjectRepository";

import ProjectModel from "../models/projectModel";
import { IProject } from "../entities/projectEntities";
import Consumer from "../events/implementation/consumer";

import SubscriptionModel from "../models/subscriptionModel";
import  ISubscription  from "../entities/subscriptionEntity";
import { commonParams } from "@aws-sdk/client-s3/dist-types/endpoint/EndpointParameters";

const container = new Container();

// Bind the interfaces to their implementations

container.bind<Consumer>("IConsumer").to(Consumer);

container.bind<IManagerController>("IManagerController").to(ManagerController);
container.bind<IManagerRepository>("IManagerRepository").to(ManagerRepository);
container.bind<IManagerService>("IManagerService").to(ManagerService);

container.bind<typeof ManagerModel>("managerModel").toConstantValue(ManagerModel);


container.bind<IDepartmentController>("IDepartmentController").to(DepartmentController);
container.bind<IDepartmentRepository>("IDepartmentRepository").to(DepartmentRepository);
container.bind<IDepartmentService>("IDepartmentService").to(DepartmentService);

container.bind<typeof DepartmentModel>("DepartmentModel").toConstantValue(DepartmentModel);

container.bind<IEmployeeController>("IEmployeeController").to(EmployeeController);
container.bind<IEmployeeRepository>("IEmployeeRepository").to(EmployeeRepository);
container.bind<IEmployeeService>("IEmployeeService").to(EmployeeService);



container.bind<typeof EmployeeModel>("EmployeeModel").toConstantValue(EmployeeModel);


container.bind<ILeaveController>("ILeaveController").to(LeaveController);
container.bind<ILeaveRepository>("ILeaveRepository").to(LeaveRepository);
container.bind<ILeaveService>("ILeaveService").to(LeaveService);

container.bind<typeof EmployeeAttendance>("IEmployeeAttendance").toConstantValue(EmployeeAttendance);


container.bind<IDashboardController>("IDashboardController").to(DashboardController);
container.bind<IDashboardService>("IDashboardService").to(DashboardService);


container.bind<IPayrollController>("IPayrollController").to(PayrollController);
container.bind<IPayrollRepository>("IPayrollRepository").to(PayrollRepository);
container.bind<IPayrollService>("IPayrollService").to(PayrollService);

container.bind<typeof PayrollCriteriaModel>("IPayrollCriteria").toConstantValue(PayrollCriteriaModel);

container.bind<typeof EmployeeLeaveModel>("IEmployeeLeave").toConstantValue(EmployeeLeaveModel);
container.bind<typeof AppliedLeaveModel>("IAppliedLeave").toConstantValue(AppliedLeaveModel);

container.bind<IProjectController>("IProjectController").to(ProjectController);
container.bind<IProjectRepository>("IProjectRepository").to(ProjectRepository);
container.bind<IProjectService>("IProjectService").to(ProjectService);

container.bind<typeof ProjectModel>("IProject").toConstantValue(ProjectModel);
container.bind<typeof SubscriptionModel>("ISubscription").toConstantValue(SubscriptionModel);



export default container;
