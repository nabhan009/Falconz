// src/components/SmoothScroll.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SmoothScroll = ({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  yOffset = 50,
  staggerChildren = 0.2,
  margin = "-50px" 
}) => {
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: yOffset 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeOut",
        delay: delay,
        when: "beforeChildren",
        staggerChildren: staggerChildren
      }
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin }}
      className="w-full"
    >
      <motion.div variants={childVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SmoothScroll;