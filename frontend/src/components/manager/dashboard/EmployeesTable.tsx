import { useState } from "react";
import { FaSearch, FaFileCsv, FaFileExcel, FaEdit, FaLock, FaUnlock, FaSignOutAlt, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import DebouncedInput from "../../ui/DebouncedInput";
import { Skeleton, Modal } from "antd";
import EmployeeInfoModal from "../../ui/EmployeeInfo";
import { managerInstance } from "../../../services/managerInstance";
import { useDispatch } from "react-redux";
import { setEmployeeDatas, clearEmployeeData } from "../../../redux/slices/managerSlice";
import { IEmployee } from "../../../interface/managerInterface";

const EmployeesTable = ({ data, loading, error, onUpdate }: { data: IEmployee[]; loading: boolean; error: string | null; onUpdate: () => void }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useDispatch();

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data), "Data");
    XLSX.writeFile(workbook, "Data.xlsx");
  };

  const showConfirmModal = (action: 'block' | 'remove', employee: IEmployee) => {
    const title = action === 'block' 
      ? `${employee.isBlocked ? 'Unblock' : 'Block'} Employee`
      : 'Remove Employee';
    const content = action === 'block'
      ? `Are you sure you want to ${employee.isBlocked ? 'unblock' : 'block'} ${employee.name}?`
      : `Are you sure you want to remove ${employee.name}?`;

    Modal.confirm({
      title,
      content,
      centered: true,
      okText: action === 'remove' ? 'Remove' : (employee.isBlocked ? 'Unblock' : 'Block'),
      okButtonProps: {
        danger: action === 'remove' || !employee.isBlocked,
      },
      onOk: () => handleClick(action, employee.employeeId as string, employee.isBlocked),
    });
  };

  const handleClick = async (action: 'edit' | 'block'| 'remove', employeeId: string, isBlocked?: boolean) => {
    try {
      let response;
      if (action === 'edit') {
        response = await managerInstance.get(`/manager-service/api/employee/get-employee/${employeeId}`);
        setSelectedEmployeeId(employeeId);
        dispatch(clearEmployeeData());
        dispatch(setEmployeeDatas({ employeeData: response.data }));
        setIsModalVisible(true);
      } else if (action === 'block') {
        response = await managerInstance.post(`/manager-service/api/employee/update-blocking/${employeeId}`, { isBlocked: !isBlocked });
        dispatch(setEmployeeDatas({ employeeData: data.map((e) => e.employeeId === employeeId ? { ...e, isBlocked: !isBlocked } : e) }));
      } else if (action === "remove") {
        await managerInstance.delete(`/manager-service/api/employee/remove-employee/${employeeId}`);
      }
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    setSelectedEmployeeId(null);
    dispatch(clearEmployeeData());
    setIsModalVisible(false);
  };

  const handleEmployeeUpdate = () => {
    onUpdate();
    handleCancel();
  };

  const filteredData = data.filter((e) => e.name?.toLowerCase().includes(globalFilter.toLowerCase()));
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div className="w-full lg:w-1/2 flex items-center space-x-2">
          <FaSearch className="text-gray-400" />
          <DebouncedInput value={globalFilter} onChange={setGlobalFilter} className="p-2 border-b-2 border-gray-600 bg-gray-100 w-full" placeholder="Search..." />
        </div>
        <div className="flex space-x-3">
          <CSVLink data={data} filename={"Data.csv"}>
            <motion.button className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              <FaFileCsv className="mr-2" /> CSV
            </motion.button>
          </CSVLink>
          <motion.button onClick={exportToExcel} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            <FaFileExcel className="mr-2" /> Excel
          </motion.button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4 p-4">
              <Skeleton.Input active style={{ width: 80 }} />
              <Skeleton.Input active style={{ width: 120 }} />
              <Skeleton.Input active style={{ width: 100 }} />
            </div>
          ))
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["Employee", "Position", "Email", "Status", "Actions"].map((header) => (
                  <th key={header} className="px-4 py-2 text-xs sm:text-sm text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((employee, i) => (
                <motion.tr key={employee.employeeId} className={`bg-gray-${i % 2 === 0 ? "100" : "200"} hover:bg-gray-300`}>
                  <td className="px-6 py-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-3">
                      {employee.profilePicture ? (
                        <img src={employee.profilePicture} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-400 text-lg" />
                        </div>
                      )}
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs sm:text-sm">{employee.position || "N/A"}</td>
                  <td className="px-6 py-4 text-xs sm:text-sm">{employee.email || "N/A"}</td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    <span className={employee.isBlocked ? "text-red-500" : "text-green-500"}>{employee.isBlocked ? "Blocked" : "Active"}</span>
                  </td>
                  <td className="px-4 py-2 text-xs sm:text-sm">
                    <div className="flex space-x-3 justify-center">
                      <motion.button onClick={() => handleClick('edit', employee.employeeId as string)} className="text-white w-24 h-10 bg-blue-500 hover:bg-blue-600 flex items-center justify-center rounded-md">
                        <FaEdit className="mr-2" /> Edit
                      </motion.button>
                      <motion.button onClick={() => showConfirmModal('block', employee)} className={`text-white w-24 flex items-center justify-center rounded-md ${employee.isBlocked ? "bg-red-500" : "bg-green-500"}`}>
                        {employee.isBlocked ? <><FaUnlock className="mr-2" /> Unblock</> : <><FaLock className="mr-2" /> Block</>}
                      </motion.button>
                      <motion.button onClick={() => showConfirmModal('remove', employee)} className="text-white w-24 bg-red-500 flex items-center justify-center rounded-md">
                        <FaSignOutAlt className="mr-2" /> Remove
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {!paginatedData.length && <tr><td colSpan={5} className="text-center py-4">No data available</td></tr>}
            </tbody>
          </table>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {pageCount}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      <EmployeeInfoModal 
        visible={isModalVisible} 
        onClose={handleCancel}
        onUpdate={handleEmployeeUpdate}
        employeeId={selectedEmployeeId}
      />
    </div>
  );
};

export default EmployeesTable;