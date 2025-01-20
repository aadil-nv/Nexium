import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, Trash } from 'lucide-react';

interface INotification {
  _id: string;
  message: string;
  title: string;
  type: string;
  description: string;
  read: boolean;
  createdAt?: string;
}

interface NotificationMenuProps {
  notifications: INotification[];
  onNotificationClick: (id: string) => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
  themeColor?: string;
  isOpen: boolean;
  onClose: () => void;
}




const NotificationMenu: React.FC<NotificationMenuProps> = ({ 
  notifications, 
  onNotificationClick, 
  onClearNotification, 
  onClearAll, 
  themeColor = '#4F46E5',
  isOpen,
  onClose 
}) => {
  console.log('+=====notifications+++++=', notifications);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Different variants for mobile and desktop
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      y: '100%'
    },
    visible: { 
      opacity: 1,
      y: 0
    },
    exit: { 
      opacity: 0,
      y: '100%'
    }
  };

  const desktopMenuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      y: -20
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay backdrop */}
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div 
            className="fixed md:absolute bottom-0 md:top-12 left-0 md:left-auto right-0 md:right-2 z-50 w-full md:w-96 h-[85vh] md:h-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: window.innerWidth >= 768 ? desktopMenuVariants.hidden : mobileMenuVariants.hidden,
              visible: window.innerWidth >= 768 ? desktopMenuVariants.visible : mobileMenuVariants.visible,
              exit: window.innerWidth >= 768 ? desktopMenuVariants.exit : mobileMenuVariants.exit
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-t-xl md:rounded-xl shadow-xl border border-gray-200 overflow-hidden h-full md:h-auto">
              {/* Header */}
              <div className="sticky top-0 flex justify-between items-center px-4 py-4 md:py-3 border-b bg-white">
                <div className="flex items-center gap-2">
                  <Bell size={20} style={{ color: themeColor }} />
                  <span className="font-semibold text-gray-800 text-lg md:text-base">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full font-medium"
                      style={{ backgroundColor: `${themeColor}20`, color: themeColor }}>
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {notifications.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-sm px-3 py-1.5 rounded-md flex items-center gap-1"
                      onClick={onClearAll}
                      style={{ 
                        backgroundColor: `${themeColor}10`,
                        color: themeColor
                      }}
                    >
                      <Trash size={16} />
                      <span className="hidden md:inline">Clear All</span>
                    </motion.button>
                  )}
                  <button 
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-md"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Notification List */}
              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                <AnimatePresence>
                  {notifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-12 px-4"
                    >
                      <div className="text-gray-300 mb-3">
                        <Bell size={32} />
                      </div>
                      <span className="text-gray-500 text-center">
                        Your notification inbox is empty
                      </span>
                    </motion.div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="relative"
                          onMouseEnter={() => setHoveredId(item._id)}
                          onMouseLeave={() => setHoveredId(null)}
                          style={{ 
                            backgroundColor: !item.read ? `${themeColor}05` : 'transparent'
                          }}
                        >
                          <div 
                            onClick={() => onNotificationClick(item._id)}
                            className="flex items-start gap-3 px-4 py-4 md:py-3 cursor-pointer hover:bg-gray-50"
                          >
                            {!item.read && (
                              <div className="mt-1.5">
                                <div className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: themeColor }} />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={`text-base md:text-sm ${!item.read ? 'font-semibold' : ''} text-gray-900`}>
                                {item.message}
                              </div>
                              <div className="text-sm md:text-xs text-gray-500 mt-1 line-clamp-2">
                                {item.title}
                              </div>
                            </div>
                            
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: hoveredId === item._id || window.innerWidth < 768 ? 1 : 0 }}
                              className="flex items-center gap-2"
                            >
                              {item.read ? (
                                <Check size={18} className="text-green-500" />
                              ) : null}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onClearNotification(item._id);
                                }}
                                className="p-1.5 rounded-full hover:bg-gray-200"
                              >
                                <X size={18} className="text-gray-400 hover:text-gray-600" />
                              </motion.button>
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationMenu;