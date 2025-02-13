import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaInfoCircle, FaUserLock, FaUnlock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import useTheme from "../../hooks/useTheme";
import { IManagerCardProps, IManagerDetails } from "../../interface/managerInterface";
import { businessOwnerInstance } from "../../services/businessOwnerInstance";
import InfoModal from "../ui/InfoModal";

const ManagerCard: React.FC<IManagerCardProps> = ({
  image,
  name,
  email,
  isActive,
  isVerified,
  isBlocked: initialIsBlocked,
  managerId,
  onUpdate,
}) => {
  const { themeColor } = useTheme();
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [managerDetails, setManagerDetails] = useState<IManagerDetails | null>(null);
  const [currentImage, setCurrentImage] = useState(image);
  console.log("CURRENT IMAGE IS ==>",currentImage);
  

  const fetchManagerDetails = async () => {
    try {
      const response = await businessOwnerInstance.get<IManagerDetails>(
        `/businessOwner-service/api/manager/get-manager/${managerId}`
      );
      if (response.data) {
        setManagerDetails(response.data);
        // Update the image if profile picture has changed
        if (response.data.personalDetails?.profilePicture) {
          setCurrentImage(response.data.personalDetails.profilePicture);
        }
      }
    } catch (error) {
      console.error("Error fetching manager details:", error);
      alert("Failed to load manager details.");
    }
  };

  const handleViewDetails = async () => {
    await fetchManagerDetails();
    setIsInfoModalVisible(true);
  };

  const handleToggleStatus = async () => {
    try {
      const response = await businessOwnerInstance.patch(
        "/businessOwner-service/api/manager/block-manager",
        {
          managerId,
          isBlocked: !isBlocked,
        }
      );
      if (response.data.success) {
        setIsBlocked((prev) => !prev);
        alert(`Manager successfully ${isBlocked ? "unblocked" : "blocked"}!`);
      } else {
        alert("Failed to update manager status.");
      }
    } catch (error) {
      console.error("Error toggling manager status:", error);
      alert("An error occurred while updating the manager status.");
    }
  };

  const handleManagerUpdate = async () => {
    await fetchManagerDetails();
    if (onUpdate) {
      onUpdate(managerId);
    }
  };

  return (
    <motion.div 
      className="w-full sm:w-72 md:w-80 lg:w-96 mx-auto bg-white rounded-lg shadow-lg overflow-hidden text-center relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`absolute top-2 right-2 w-4 h-4 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />

      <img 
        className="w-24 h-24 object-cover rounded-full mx-auto mt-4" 
        src={currentImage || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"} 
        alt="Manager Profile" 
      />

      <div className="p-4">
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {managerDetails?.personalDetails?.managerName || name}
          </h2>
          {isVerified ? (
            <FaCheckCircle className="text-green-500 ml-2" size={20} />
          ) : (
            <FaTimesCircle className="text-red-500 ml-2" size={20} />
          )}
        </div>
        <p className="text-gray-600 text-sm truncate">
          {managerDetails?.personalDetails?.email || email}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
          <motion.button
            onClick={handleViewDetails}
            className="text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ backgroundColor: themeColor }}
          >
            <FaInfoCircle size={16} />
            <span className="text-sm">Info</span>
          </motion.button>

          <motion.button
            onClick={handleToggleStatus}
            className={`text-white px-4 py-2 rounded transition duration-300 w-full sm:w-auto flex items-center justify-center gap-2 text-sm ${
              isBlocked ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isBlocked ? <FaUserLock size={16} /> : <FaUnlock size={16} />}
            <span className="text-sm">{isBlocked ? "Unblock" : "Block"}</span>
          </motion.button>
        </div>
      </div>

      {isInfoModalVisible && (
        <InfoModal
          visible={isInfoModalVisible}
          onClose={() => setIsInfoModalVisible(false)}
          managerId={managerId}
          managerDetails={managerDetails}
          onUpdate={handleManagerUpdate}
        />
      )}
    </motion.div>
  );
};

export default ManagerCard;