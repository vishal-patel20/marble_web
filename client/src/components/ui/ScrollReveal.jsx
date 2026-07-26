import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

/**
 * ScrollReveal — wraps children in a Framer Motion viewport-triggered fade+slide animation.
 * Mirrors the `.reveal` CSS utility from the Stitch design.
 */
export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px 0px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden:  { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0,  transition: { duration, delay, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
