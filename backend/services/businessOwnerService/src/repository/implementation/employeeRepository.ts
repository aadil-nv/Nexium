import IEmployeeRepository from "../interface/IEmployeeRepository";
import mongoose from "mongoose";
import { injectable } from "inversify";
import EmployeeModel from "../../models/employeeModel";
import businessOwnerModel from "../../models/businessOwnerModel";
import { IBusinessOwnerDocument } from "../../entities/businessOwnerEntity";
import leaveTypeModel from "../../models/leaveTypeModel";
import employeeLeaveModel from "../../models/employeeLeaveModel";

@injectable()
export default class EmployeeRepository implements IEmployeeRepository {
  
  async getProfile(employeeId: string, businessOwnerId: string): Promise<any > {
    try {
      const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
      const Employee = _switchDb.model('employees', EmployeeModel.schema);
      return await Employee.findById(employeeId);
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      throw error;
    }
  }


async getDashboardData(businessOwnerId: string): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });

    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({ isActive: true });

    const verifiedEmployees = await Employee.countDocuments({ isVerified: true });

    return {
      totalEmployees,
      activeEmployees,
      verifiedEmployees,
    };
  } catch (error) {
    console.error("Error retrieving dashboard data: ", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}

async getAllEmployees(businessOwnerId: string): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);
    return await Employee.find();
  } catch (error) {
    console.error("Error retrieving employees: ", error);
    throw new Error("Failed to fetch employees.");
  }
}



async getBusinessOwnerData(businessOwnerId: string): Promise<IBusinessOwnerDocument> {
  try {
    const businessOwner = await businessOwnerModel.findById(businessOwnerId);
    if (!businessOwner) {
      throw new Error(`BusinessOwner with ID ${businessOwnerId} not found`);
    }
    return businessOwner;
  } catch (error) {
    console.error("Error fetching employee profile:", error);
    throw error;
  }
}

async findByEmail(businessOwnerId: string, emailId: string): Promise<any> {
  try {
      const safeBusinessOwnerId = businessOwnerId.replace(/\./g, '_');

      const _switchDb = mongoose.connection.useDb(safeBusinessOwnerId, { useCache: true });

      const Employee = _switchDb.model('employees', EmployeeModel.schema);

      return await Employee.findOne({ 'personalDetails.email': emailId });
  } catch (error) {
      console.error("Error finding employee by email:", error);
      throw error;
  }
}


async addEmployee(employeeData: any, businessOwnerId: string): Promise<any> {
  try {
    // Connect to the specific business database
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);
    const LeaveType = _switchDb.model('leavetypes', leaveTypeModel.schema);
    const EmployeeLeaveModel = _switchDb.model('employeeleaves', employeeLeaveModel.schema);

    // Generate a shared _id
    const employeeId = new mongoose.Types.ObjectId();

    // Create employee with the same _id in both databases
    const savedEmployee = await Employee.create({ ...employeeData, _id: employeeId });
    await EmployeeModel.create({ ...employeeData, _id: employeeId });

    // Fetch existing leave types
    const existingLeaves = await LeaveType.findOne({businessOwnerId: businessOwnerId});
    if (!existingLeaves) throw new Error("No leave types found");

    // Assign leave types to the employee
    const employeeLeaveData = {
      employeeId,
      sickLeave: existingLeaves.sickLeave,
      casualLeave: existingLeaves.casualLeave,
      maternityLeave: existingLeaves.maternityLeave,
      paternityLeave: existingLeaves.paternityLeave,
      paidLeave: existingLeaves.paidLeave,
      unpaidLeave: existingLeaves.unpaidLeave,
      compensatoryLeave: existingLeaves.compensatoryLeave,
      bereavementLeave: existingLeaves.bereavementLeave,
      marriageLeave: existingLeaves.marriageLeave,
      studyLeave: existingLeaves.studyLeave,
    };

    await EmployeeLeaveModel.create(employeeLeaveData);

    return savedEmployee;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw new Error("Failed to add employee.");
  }
}




async removeEmployee(employeeId: string, businessOwnerId: string): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);
   
    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
    await EmployeeModel.findByIdAndDelete(employeeId);
    return deletedEmployee;
  } catch (error) {
    console.error("Error removing employee: ", error);
    throw new Error("Failed to remove employee.");
  }


}


async blockEmployee(employeeId: string, businessOwnerId: string): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    const employee = await Employee.findById(employeeId);
    if (!employee) throw new Error("Employee not found");

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { isBlocked: !employee.isBlocked }, 
      { new: true } 
    );

    await EmployeeModel.findByIdAndUpdate(
      employeeId,
      { isBlocked: !employee.isBlocked }, 
      { new: true } 
    );

    return updatedEmployee;
  } catch (error) {
    console.error("Error toggling employee block status: ", error);
    throw new Error("Failed to update employee block status.");
  }
}


async updateProfessionalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    // Construct update data
    const updateData = {
      $set: {
        "professionalDetails.position": data.position,
        "professionalDetails.workTime": data.workTime,
        "professionalDetails.department": data.department,
        "professionalDetails.joiningDate": data.joiningDate,
        "professionalDetails.currentStatus": data.currentStatus,
        "professionalDetails.companyName": data.companyName,
        "professionalDetails.companyLogo": data.companyLogo,
        "professionalDetails.salary": data.salary,
        "professionalDetails.uanNumber": data.uanNumber,
        "professionalDetails.pfAccount": data.pfAccount,
        "professionalDetails.esiAccount": data.esiAccount,
      },
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );

    if (!updatedEmployee) throw new Error("Employee not found");

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee professional info: ", error);
    throw new Error("Failed to update employee professional info.");
  }
}



async updateAddressInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
  
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    // Construct update data
    const updateData = {
      $set: {
        "address.street": data.street,
        "address.city": data.city,
        "address.state": data.state,
        "address.country": data.country,
        "address.postalCode": data.postalCode,
      },
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );

    await EmployeeModel.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    )

    if (!updatedEmployee) throw new Error("Employee not found");

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee address info: ", error);
    throw new Error("Failed to update employee address info.");
  }
}



async updateSecurityInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    // Construct update data
    const updateData = {
      $set: {
        "employeeCredentials.companyEmail": data.companyEmail,
        "employeeCredentials.companyPassword": data.companyPassword,
      },
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );
    await EmployeeModel.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    )

    if (!updatedEmployee) throw new Error("Employee not found");

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee security info: ", error);
    throw new Error("Failed to update employee security info.");
  }
}



async updatePersonalInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> { 

  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    // Construct update data while excluding profilePicture
    const updateData = {
      $set: {
        "personalDetails.employeeName": data.employeeName,
        "personalDetails.personalWebsite": data.website,
        "personalDetails.email": data.email,
        "personalDetails.phone": data.phone,
        "personalDetails.bankAccountNumber": data.bankAccountNumber,
        "personalDetails.ifscCode": data.ifscCode,
        "personalDetails.aadharNumber": data.aadharNumber,
        "personalDetails.panNumber": data.panNumber,
        "personalDetails.gender": data.gender,
      },
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    );
    await EmployeeModel.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true }
    )

    if (!updatedEmployee) throw new Error("Employee not found");

    return updatedEmployee;
  } catch (error) {
    console.error("Error updating employee personal info: ", error);
    throw new Error("Failed to update employee personal info.");
  }
}

async uploadProfilePic(employeeId: string, businessOwnerId: string, fileUrl: string): Promise<any> {
  try {
    // Switch to the correct database for the business owner
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const Employee = _switchDb.model('employees', EmployeeModel.schema);

    // Find and update the employee's profile picture
    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { $set: { "personalDetails.profilePicture": fileUrl } },
      { new: true }
    );

    EmployeeModel.findByIdAndUpdate(
      employeeId,
      { $set: { "personalDetails.profilePicture": fileUrl } },
      { new: true }
    )

    if (!updatedEmployee) {
      throw new Error('Employee not found');
    }

    return updatedEmployee
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw new Error('Error updating profile picture');
  }
}


async getEmployeeLeave(businessOwnerId: string): Promise<any> {
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const EmployeeLeaveModel = _switchDb.model('EmployeeLeave',   employeeLeaveModel.schema);

    const employeeLeaves = await EmployeeLeaveModel.find().exec();
    
    return employeeLeaves;
  } catch (error) {
    console.error("Error fetching employee leaves:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred.");
  }
}

async updateEmployeeLeaveInfo(employeeId: string, businessOwnerId: string, data: any): Promise<any> {
  console.log("updateEmployeeLeaveInfo called");
  console.log("Data:", data);
  console.log("Business Owner ID:", businessOwnerId);
  console.log("Employee ID:", employeeId);
  
  try {
    const _switchDb = mongoose.connection.useDb(businessOwnerId, { useCache: true });
    const EmployeeLeaveModel = _switchDb.model('EmployeeLeave', employeeLeaveModel.schema);

    // Construct update data based on leave fields in the schema
    const updateData = {
      $set: {
        sickLeave: data.sickLeave,
        casualLeave: data.casualLeave,
        maternityLeave: data.maternityLeave,
        paternityLeave: data.paternityLeave,
        paidLeave: data.paidLeave,
        unpaidLeave: data.unpaidLeave,
        compensatoryLeave: data.compensatoryLeave,
        bereavementLeave: data.bereavementLeave,
        marriageLeave: data.marriageLeave,
        studyLeave: data.studyLeave,
      },
    };

    // Find the employee leave record and update
    const result = await EmployeeLeaveModel.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true, upsert: true } // Returns the updated document or creates a new one if none exists
    );

    if (!result) {
      throw new Error("Employee leave record not found or couldn't be updated.");
    }

    console.log("Employee leave info updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating employee leave info: ", error);
    throw new Error("Failed to update employee leave info.");
  }
}
}
