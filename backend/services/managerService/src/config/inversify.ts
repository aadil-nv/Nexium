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

import IOnboardingController from "../controllers/interface/IOnboardingController";
import IOnboardingService from "../service/interface/IOnboardingService";
import IOnboardingRepository from "../repository/interface/IOnboardingRepository";
import OnboardingRepository from "../repository/implementation/onboardingRepository";  // Ensure correct import
import OnboardingService from "../service/implementation/onboardingService";  // Ensure correct import
import OnboardingController from "../controllers/implementation/onboardingController";  // Ensure correct import




const container = new Container();

// Bind the interfaces to their implementations
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


container.bind<IOnboardingController>("IOnboardingController").to(OnboardingController);
container.bind<IOnboardingRepository>("IOnboardingRepository").to(OnboardingRepository);
container.bind<IOnboardingService>("IOnboardingService").to(OnboardingService);

container.bind<typeof EmployeeModel>("EmployeeModel").toConstantValue(EmployeeModel);

export default container;
