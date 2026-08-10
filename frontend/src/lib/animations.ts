// src/lib/animations.ts
export const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  slideInRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }
  },
  idleBob: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
  },
  wave: {
    animate: { rotate: [0, 20, -10, 20, 0] },
    transition: { duration: 1.2, ease: 'easeInOut' }
  },
  cardHover: {
    whileHover: { y: -4, transition: { duration: 0.2 } }
  },
  buttonPress: {
    whileTap: { scale: 0.97, transition: { duration: 0.1 } }
  },
  staggerContainer: {
    initial: 'hidden',
    animate: 'visible',
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } }
    }
  },
  staggerChild: {
    variants: {
      hidden: { opacity: 0, y: 12 },
      visible: { opacity: 1, y: 0 }
    }
  }
};