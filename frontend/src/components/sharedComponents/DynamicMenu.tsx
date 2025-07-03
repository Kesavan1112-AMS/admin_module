import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MenuItem,
  getMenuConfiguration,
} from "../../services/UiConfig.service";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DynamicMenuProps {
  companyId: number;
  className?: string;
}

const DynamicMenu: React.FC<DynamicMenuProps> = ({
  companyId,
  className = "",
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const location = useLocation();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await getMenuConfiguration(companyId);
        if (response.status === 1) {
          setMenuItems(response.data);
        } else {
          console.error("Failed to fetch menu:", response.msg);
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchMenu();
    }
  }, [companyId]);

  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderMenuItem = (
    item: MenuItem,
    level: number = 0
  ): React.ReactNode => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.route && location.pathname === item.route;

    const menuItemClasses = `
      flex items-center justify-between px-4 py-2 text-sm font-medium rounded-md transition-colors
      ${level > 0 ? "ml-4" : ""}
      ${
        isActive
          ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }
    `;

    const iconClasses = `
      w-4 h-4 transition-transform duration-200
      ${isExpanded ? "rotate-90" : ""}
    `;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={menuItemClasses}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
            </div>
            <ChevronRight className={iconClasses} />
          </button>
          {isExpanded && (
            <div className="mt-1">
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (item.route) {
      return (
        <Link key={item.id} to={item.route} className={menuItemClasses}>
          <div className="flex items-center space-x-2">
            {item.icon && <span className="text-lg">{item.icon}</span>}
            <span>{item.label}</span>
          </div>
        </Link>
      );
    }

    return (
      <div key={item.id} className={menuItemClasses}>
        <div className="flex items-center space-x-2">
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <p>No menu items available</p>
      </div>
    );
  }

  return (
    <nav className={`space-y-1 ${className}`}>
      {menuItems.map((item) => renderMenuItem(item))}
    </nav>
  );
};

export default DynamicMenu;
