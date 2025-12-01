import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: 'fade' | 'slide' | 'scale';
  className?: string;
}

const variants = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  slide: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
  scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } }
};

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'fade',
  className = ''
}) => {
  const variant = variants[animation];
  
  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};