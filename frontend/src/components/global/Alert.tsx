  import { motion } from 'framer-motion';
  import useTheme from '../../hooks/useTheme';

  interface AlertProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  export default function Alert({ message, onConfirm, onCancel }: AlertProps) {
    const { themeColor, themeMode } = useTheme();

    return (
      <div
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-50 bg-gray-800 bg-opacity-50"
      style={{ backdropFilter: 'blur(15px)' }} // Apply a consistent blur
    >
    
    
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-lg shadow-lg ${
            themeMode === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          } w-full max-w-sm md:max-w-md lg:max-w-lg mx-4`}
          style={{ borderColor: themeColor }}
        >
          <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: themeColor }}>
            Alert
          </h2>
          <p className="mb-6 text-center">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded transition-colors duration-300"
              style={{ backgroundColor: themeColor, color: 'white' }}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
