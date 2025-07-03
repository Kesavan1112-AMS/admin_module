import React from 'react'
import { motion } from "framer-motion";
import isteerLogo from "../../assets/images/logos/image.png";


const LoaderComponent : React.FC= () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900">
        <motion.img
          src={isteerLogo}
          className="w-40 h-40 mx-auto"
          alt="loading"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        <motion.h1
          className="font-bold text-lg text-center mt-3 mb-3 text-black dark:text-white"
          animate={{ opacity: [1, 1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          COCKPIT
        </motion.h1>

        <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500 dark:bg-blue-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
          />
        </div>
      </div>
  )
}

export default LoaderComponent