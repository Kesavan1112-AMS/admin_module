import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/header.css";
import { ChevronDown, ChevronUp, Settings, Database, Code, Sliders, Home, LayoutGrid } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../stores/Auth";

const DashboardDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const loggedUser = useSelector(
    (state: RootState) => state.loggedUserInfo.loggedUser
  );
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Close dropdown when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Check if user has configuration privileges
  const hasConfigAccess = loggedUser?.privileges?.includes(100); // Assuming 100 is the privilege ID for configuration access
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LayoutGrid className="w-4 h-4 mr-1" />
        <span className="mr-1">Menu</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1" role="menu">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleNavigation('/')}
              role="menuitem"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            
            {hasConfigAccess && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                
                <div className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customization
                </div>
                
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleNavigation('/settings/business-rules')}
                  role="menuitem"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  Business Rules
                </button>
                
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleNavigation('/settings/forms')}
                  role="menuitem"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Dynamic Forms
                </button>
                
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleNavigation('/settings/api-endpoints')}
                  role="menuitem"
                >
                  <Code className="w-4 h-4 mr-2" />
                  API Endpoints
                </button>
                
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleNavigation('/settings')}
                  role="menuitem"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardDropdown;
