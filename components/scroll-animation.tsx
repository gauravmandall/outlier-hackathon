'use client';

import { motion, useAnimation, useInView } from 'motion/react';
import { type ReactNode, useEffect, useRef } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  distance?: number;
  threshold?: number;
}

export const ScrollAnimation = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  distance = 50,
  threshold = 0.1
}: ScrollAnimationProps) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: threshold });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1.0] // Smooth easing function
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};
