import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isActive,
  ...props 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'ui-button',
        `variant-${variant}`,
        `size-${size}`,
        { 'is-active': isActive },
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
