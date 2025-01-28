import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaSignInAlt, FaCalendarAlt } from "react-icons/fa";
import { Empty } from "antd";
import AttendanceHistory from "../global/AttendanceHistory";
import Alert from "../global/Alert";
import { useDispatch} from "react-redux";
import { updateWorkDetails } from "../../redux/slices/employeeSlice";
import useAuth from "../../hooks/useAuth";
import { fetchAttendanceData, markCheckIn, markCheckOut } from "../../api/employeeApi";

type IAttendance = {
  date: string;
  status: string;
  checkInTime: string | undefined;
  checkOutTime: string;
  minutes: number;
  leaveType?: string | null;
  reason?: string | null;
  isCompleted?: boolean;
  leaveStatus?: string;
  _id: string;
};

type ICurrentStatus = {
  attendance: IAttendance[];
  currentStatus: "notMarked" | "marked" | "checkIn" | "checkout";
  employeeId: string;
};

export default function AttendanceCard() {
  const [attendanceData, setAttendanceData] = useState<IAttendance[]>([]);
  const [page, setPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [showCheckoutAlert, setShowCheckoutAlert] = useState(false);
  const [reloadData, setReloadData] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 
  const { employee } = useAuth();
  const dispatch = useDispatch();
  const [currentDayStatus, setCurrentDayStatus] = useState<ICurrentStatus>({
    attendance: [],
    currentStatus: "notMarked",
    employeeId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchAttendanceData();
        console.log("Attendance data fetched:", fetchedData.attendance);

        if (fetchedData && fetchedData.attendance) {
          setCurrentDayStatus(fetchedData);
          setAttendanceData(fetchedData.attendance);
        } else {
          setCurrentDayStatus({ attendance: [], currentStatus: "notMarked", employeeId: "" });
          setAttendanceData([]);
        }
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false); 
      }
    };
    loadData();
  }, [reloadData]); 

  const totalPages = Math.ceil(attendanceData.length / 5);
  const filteredData = attendanceData.slice((page - 1) * 5, page * 5);

  const handleCheckIn = () => setShowAlert(true);
  const handleCheckOut = () => setShowCheckoutAlert(true);

  const handleConfirmCheckIn = async () => {
    // setIsCheckedIn(true);
    setShowAlert(false);
    const checkInData = {
      date: new Date().toISOString().split("T")[0],
      checkInTime: new Date().toISOString(),
    };
    try {
      await markCheckIn(checkInData);
      setReloadData((prev) => !prev); // Trigger data refresh
    } catch (error) {
      console.error("Error during check-in:", error);
    }
  };

const handleConfirmCheckout = async () => {
    const checkOutData = {
      checkOutTime: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
    };
    try {
      await markCheckOut(checkOutData);
      // setIsCheckedIn(false);
      setShowCheckoutAlert(false);
      dispatch(
        updateWorkDetails({
          position: employee?.position || "",
          workTime: employee.workTime || "",
          workTimer: 0,
        })
      );
      setReloadData((prev) => !prev); // Trigger data refresh
    } catch (error) {
      console.error("Error during check-out:", error);
    }
  };

  const currentAttendance = currentDayStatus.attendance.find(
    (attendance) => attendance.date === new Date().toISOString().split("T")[0]
  );
  const currentStatus = currentAttendance?.status;

  return (
    <motion.div className="p-6 bg-white shadow-lg rounded-lg mt-6 max-w-4xl mx-auto sm:p-4">
      <motion.div className="mb-6 p-3 bg-gray-100 rounded-lg h-18">
        <h3 className="text-xl font-semibold text-gray-800 sm:text-lg flex items-center">
          <FaCalendarAlt className="mr-2 text-blue-500" /> Today's Attendance
        </h3>
        <div className="mt-1 text-lg font-bold text-gray-900">
          {new Date().toLocaleDateString()}
        </div>
        <div className="mt-3 flex items-center justify-between">
          {currentStatus === "notMarked" || currentStatus === undefined ? (
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center sm:text-sm sm:px-3 hover:bg-blue-600 ml-auto"
            >
              <FaSignInAlt className="mr-2" /> Check-In
            </button>
          ) : currentStatus === "Present" ? (
            <button
              onClick={handleCheckOut}
              className="px-4 py-2 bg-green-500 text-white rounded flex items-center sm:text-sm sm:px-3 hover:bg-green-600"
            >
              <FaCheckCircle className="mr-2" /> Check-Out
            </button>
          ) : (
            <div className="text-sm text-gray-500">Attendance Marked</div>
          )}
        </div>
      </motion.div>

      {attendanceData.length === 0 ? (
        <Empty description="No Data Found" />
      ) : (
        <AttendanceHistory
          attendanceData={filteredData}
          updateAttendanceData={(data: IAttendance[]) => setAttendanceData(data)}
          isLoading={isLoading} 
        />
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page > 1 ? page - 1 : 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
        >
          Next
        </button>
      </div>

      {showAlert && (
        <Alert message="Do you want to mark your attendance?" onCancel={() => setShowAlert(false)} onConfirm={handleConfirmCheckIn} />
      )}
      {showCheckoutAlert && (
        <Alert message="Do you want to check out?" onCancel={() => setShowCheckoutAlert(false)} onConfirm={handleConfirmCheckout} />
      )}
    </motion.div>
  );
}
