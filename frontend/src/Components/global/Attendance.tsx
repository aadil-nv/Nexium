import React, { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
import { FaCheckCircle, FaSignInAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import AttendanceHistory from "./AttendanceHistory";
import Alert from "./Alert";
import { employeeInstance } from "../../services/employeeInstance";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { updateWorkDetails } from "../../redux/slices/employeeSlice";

type Attendance = {
  date: string;
  status: string;
  checkInTime: string | undefined;
  checkOutTime: string;
  hours: number;
  leaveType?: string | null;
  reason?: string | null;
  fullDay: boolean;
};
type ICurrentStatus = {
  attendance :Attendance[],
  currentStatus: "unMarked" | "marked";
} 

export default function AttendanceCard() {
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [page, setPage] = useState(1);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [confirmCheckIn, setConfirmCheckIn] = useState(false);
  const [showCheckoutAlert, setShowCheckoutAlert] = useState(false);
  const itemsPerPage = 5;
  const { employee } = useAuth();
  const dispatch = useDispatch();
  const workTimer = useSelector((state: any) => state.employee.workTimer);
  const [currentDayStatus, setCurrentDayStatus] = useState <ICurrentStatus>({ attendance: [], currentStatus: "unMarked" });

  const fetchAttendanceData = () => {
    employeeInstance
      .get("/employee/api/attendance/get-attendances")
      .then((response) => {
        const fetchedData = response.data[0]?.attendance || [];
        const fetchStaus = response.data[0]
        setCurrentDayStatus(fetchStaus);
        setAttendanceData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    if (!isCheckedIn) {
      fetchAttendanceData();
    }
  }, [isCheckedIn]);

  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  const filteredData = attendanceData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    if (isCheckedIn) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;
          setProgress((newTime / 28800) * 100);
          dispatch(updateWorkDetails({ position: employee?.position || "", workTime: employee?.workTime || "", workTimer: newTime }));
          return newTime;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCheckedIn, dispatch, employee]);

  const handleCheckIn = () => {
    setShowAlert(true);
  };

  const handleCheckOut = () => {
    setShowCheckoutAlert(true);
  };

  const handleRegisterTodayAttendance = () => {
    if (!attendanceData.some((attendance) => attendance.date === new Date().toISOString().split("T")[0])) {
      setAttendanceData((prevData) => [
        ...prevData,
        {
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          checkInTime: new Date().toLocaleTimeString(),
          checkOutTime: "",
          hours: 0,
          fullDay: true,
        },
      ]);
    }
  };

  const currentDate = new Date().toLocaleDateString();

  const handleConfirmCheckIn = () => {
    setIsCheckedIn(true);
    setShowAlert(false);
    handleRegisterTodayAttendance();

    const checkInData = {
      date: new Date().toISOString().split("T")[0],
      checkInTime: new Date().toISOString(),
    };

    employeeInstance
      .post("/employee/api/attendance/mark-checkin/", checkInData)
      .then((response) => {
        console.log("Check-in success:", response.data);
        fetchAttendanceData();  // Refresh data after successful check-in
      })
      .catch((error) => {
        console.error("Error marking check-in:", error);
      });
  };

  const handleCancelCheckIn = () => {
    setShowAlert(false);
  };

  const handleConfirmCheckout = () => {
    const checkOutData = {
      workTime: timer,
      checkOutTime: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
    };

    employeeInstance.post("/employee/api/attendance/mark-checkout", checkOutData)
      .then((response) => {
        console.log("Checkout success:", response.data);
        setIsCheckedIn(false);
        setShowCheckoutAlert(false);
        dispatch(updateWorkDetails({ position: employee?.position || "", workTime: employee?.workTime || "", workTimer: 0 }));
        fetchAttendanceData();  // Refresh data after successful checkout
      })
      .catch((error) => {
        console.error("Error marking checkout:", error);
      });
  };

  const handleCancelCheckout = () => {
    setShowCheckoutAlert(false);
  };
  
  // Check today's attendance status
  const currentAttendance = currentDayStatus.attendance.find(entry => entry.date === currentDate);

    console.log("No attendance data found for today.",currentAttendance);
    const currentStatus = currentAttendance?.status;
    return null;






  return (
    <motion.div className="p-6 bg-white shadow-lg rounded-lg mt-6 max-w-4xl mx-auto sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <motion.div className="mb-6 p-3 bg-gray-100 rounded-lg h-18" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <h3 className="text-xl font-semibold text-gray-800 sm:text-lg flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-500" /> Today's Attendance
        </h3>
        <div className="mt-1 text-lg font-bold text-gray-900">{currentDate}</div>
        <div className="mt-3 flex items-center justify-between">
          {/* Logic to show Check-In, Check-Out or Attendance Marked based on current status */}
          {currentStatus === "notMarked" || currentStatus === undefined ? (
            <button onClick={handleCheckIn} className="px-4 py-2 bg-blue-500 text-white rounded flex items-center sm:text-sm sm:px-3 hover:bg-blue-600 ml-auto">
              <FaSignInAlt className="mr-2" /> Check-In
            </button>
          ) : currentStatus === "checkIn" ? (
            <button onClick={handleCheckOut} className="px-4 py-2 bg-green-500 text-white rounded flex items-center sm:text-sm sm:px-3 hover:bg-green-600">
              <FaCheckCircle className="mr-2" /> Check-Out
            </button>
          ) : currentStatus === "marked" ? (
            <div className="text-sm text-gray-500">Attendance Marked</div>
          ) : null}
        </div>
      </motion.div>
      <AttendanceHistory attendanceData={filteredData} />
      <div className="flex justify-between mt-4">
        <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page === 1} className="text-gray-800 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 sm:text-sm">
          Previous
        </button>
        <button onClick={() => setPage(page < totalPages ? page + 1 : totalPages)} disabled={page === totalPages} className="text-gray-800 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 sm:text-sm">
          Next
        </button>
      </div>
      {showAlert && (
        <Alert
          message="Are you sure you want to check in?"
          onConfirm={handleConfirmCheckIn}
          onCancel={handleCancelCheckIn}
        />
      )}
      {showCheckoutAlert && (
        <Alert
          message="Are you sure you want to check out?"
          onConfirm={handleConfirmCheckout}
          onCancel={handleCancelCheckout}
        />
      )}
    </motion.div>
  );
}
