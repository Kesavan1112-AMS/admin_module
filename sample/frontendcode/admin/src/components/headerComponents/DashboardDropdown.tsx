import React, { useRef, useState } from "react";
import "../../styles/header.css";


const DashboardDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="relative">
      <div className="relative inline-flex w-full justify-center">
        <button
          ref={buttonRef}
          className="rounded-md px-2 py-1 text-xs font-bold text-gray-600 shadow-xs ring-inset hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 group dark:text-white relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          DASHBOARD
          <div className="absolute top-10 left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1 text-[10px] text-white bg-gray-600 rounded-md shadow-sm transition-all duration-300 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none">
            Dashboard Menu
          </div>
        </button>
      </div>
    </div>
  );
};

export default DashboardDropdown;
