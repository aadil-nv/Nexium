// components/AnimatedIcon.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  icon: React.ReactNode;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({ icon }) => (
  <motion.div
    initial={{ scale: 1 }}
    whileHover={{ scale: 1.2, rotate: 10 }}
    whileTap={{ scale: 0.9 }}
    style={{ display: "inline-flex" }}
  >
    {icon}
  </motion.div>
);