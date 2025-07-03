import React, { useRef, useState } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import "../../styles/header.css";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem } from "../sharedComponents/Menu";

const LanguageDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="py-1"
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
      >
        <FaGlobeAmericas className="w-5 h-6 dark:text-white transition-colors duration-300" />
      </button>
      <Menu
        anchorEl={buttonRef.current}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        offsetY={15}
        offsetX={-60}
      >
        <MenuItem onClick={() => changeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => changeLanguage("id")}>Indonesia</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageDropdown;
