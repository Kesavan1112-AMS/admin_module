import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type Position = "top" | "bottom" | "left" | "right";

interface MenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: Position;
  offsetX?: number;
  offsetY?: number;
  className?: string;
  style?: CSSProperties;
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Menu = ({
  anchorEl,
  open,
  onClose,
  children,
  position = "bottom",
  offsetX = 0,
  offsetY = 0,
  className = "",
  ...props
}: MenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (open && anchorEl) {
      const rect = anchorEl.getBoundingClientRect();
      const positionStyles = {
        bottom: { top: rect.bottom + offsetY, left: rect.left + offsetX },
        top: { top: rect.top + offsetY, left: rect.left + offsetX },
        right: { top: rect.top + offsetY, left: rect.right + offsetX },
        left: { top: rect.top + offsetY, left: rect.left - 200 + offsetX },
      };
      setMenuPosition(positionStyles[position]);
    }
  }, [open, anchorEl, position, offsetX, offsetY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        open
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          className={`fixed z-50 bg-white shadow-lg rounded-md py-2 max-w-[200px] min-w-[200px] dark:bg-gray-800 ${className}`}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MenuItemProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  className?: string;
  component?: React.ElementType;
  [key: string]: any;
}

const MenuItem = ({
  children,
  to,
  onClick,
  className = "",
  component: Component = "div",
  ...props
}: MenuItemProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Component
      to={to}
      onClick={handleClick}
      className={clsx("menu-item", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Menu, MenuItem };
