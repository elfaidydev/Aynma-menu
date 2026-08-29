export const ease = {
  smooth: [0.22, 1, 0.36, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  spring: { type: "spring" as const, stiffness: 110, damping: 18, mass: 0.85 },
  springSnappy: { type: "spring" as const, stiffness: 180, damping: 22, mass: 0.7 },
};

export const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.25 },
  },
};

export const heroItem = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: ease.outExpo },
  },
};

export const sectionTitle = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: ease.outExpo },
  },
};

export const sectionSubtitle = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ease.smooth, delay: 0.12 },
  },
};

export const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.08 },
  },
};

export const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: ease.outExpo },
  },
};

export const railContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.1 },
  },
};

export const railCardReveal = {
  hidden: { opacity: 0, x: 36, scale: 0.97, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: ease.outExpo },
  },
};
