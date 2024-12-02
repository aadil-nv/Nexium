import { employeeInstance } from "../services/employeeInstance";

// Fetch all attendance data
export const fetchAttendanceData = async () => {
  try {
    const response = await employeeInstance.get("/employee/api/attendance/get-attendances");
    return response.data[0];
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    throw error; // or return a default value
  }
};

// Mark attendance for check-in
export const markCheckIn = async (checkInData) => {
  try {
    const response = await employeeInstance.post("/employee/api/attendance/mark-checkin/", checkInData);
    return response.data;
  } catch (error) {
    console.error("Error marking check-in:", error);
    throw error;
  }
};

// Mark attendance for check-out
export const markCheckOut = async (checkOutData) => {
  try {
    const response = await employeeInstance.post("/employee/api/attendance/mark-checkout", checkOutData);
    console.log("response==>=>=>",response.data);
    return response.data;
  } catch (error) {
    console.error("Error marking checkout:", error);
    throw error;
  }
};
