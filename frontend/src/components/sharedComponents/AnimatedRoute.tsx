import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedRouteProps {
  children: ReactNode;
  routeKey: string;
}

const AnimatedRoute = ({ children, routeKey }: AnimatedRouteProps) => {
  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{
        duration: 1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
