import React from "react";
import { MenuItem } from "../../services/UiConfig.service";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Settings,
  Database,
  Shield,
  FileText,
  BarChart3,
  Workflow,
  Building,
  UserCheck,
  Layers,
  Menu,
  Home,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Star,
  Heart,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Lock,
  Unlock,
  Power,
  Activity,
  TrendingUp,
  TrendingDown,
  Package,
  Tag,
  Bookmark,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
  Code,
  Terminal,
  Cpu,
  HardDrive,
  Wifi,
  Bluetooth,
  Battery,
  Camera,
  Microphone,
  Speaker,
  Headphones,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Server,
  Monitor,
  Printer,
  Keyboard,
  Mouse,
  Gamepad2,
  Joystick,
  Gamepad,
} from "lucide-react";

interface DynamicMenuRendererProps {
  menuItems: MenuItem[];
  variant?: "horizontal" | "vertical" | "cards" | "sidebar";
  className?: string;
}

const getIconComponent = (iconName?: string) => {
  const icons: Record<string, React.ComponentType<any>> = {
    users: Users,
    settings: Settings,
    database: Database,
    shield: Shield,
    filetext: FileText,
    barchart3: BarChart3,
    workflow: Workflow,
    building: Building,
    usercheck: UserCheck,
    layers: Layers,
    menu: Menu,
    home: Home,
    plus: Plus,
    edit: Edit,
    trash2: Trash2,
    eye: Eye,
    search: Search,
    filter: Filter,
    download: Download,
    upload: Upload,
    refreshcw: RefreshCw,
    save: Save,
    x: X,
    check: Check,
    alertcircle: AlertCircle,
    info: Info,
    helpcircle: HelpCircle,
    star: Star,
    heart: Heart,
    calendar: Calendar,
    clock: Clock,
    mail: Mail,
    phone: Phone,
    globe: Globe,
    lock: Lock,
    unlock: Unlock,
    power: Power,
    activity: Activity,
    trendingup: TrendingUp,
    trendingdown: TrendingDown,
    package: Package,
    tag: Tag,
    bookmark: Bookmark,
    archive: Archive,
    folder: Folder,
    file: File,
    image: Image,
    video: Video,
    music: Music,
    code: Code,
    terminal: Terminal,
    cpu: Cpu,
    harddrive: HardDrive,
    wifi: Wifi,
    bluetooth: Bluetooth,
    battery: Battery,
    camera: Camera,
    microphone: Microphone,
    speaker: Speaker,
    headphones: Headphones,
    smartphone: Smartphone,
    tablet: Tablet,
    laptop: Laptop,
    desktop: Desktop,
    server: Server,
    monitor: Monitor,
    printer: Printer,
    keyboard: Keyboard,
    mouse: Mouse,
    gamepad2: Gamepad2,
    joystick: Joystick,
    gamepad: Gamepad,
  };

  const normalizedIconName = iconName?.toLowerCase().replace(/[-_\s]/g, "");
  return icons[normalizedIconName || "menu"] || Menu;
};

const DynamicMenuRenderer: React.FC<DynamicMenuRendererProps> = ({
  menuItems,
  variant = "horizontal",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleMenuClick = (item: MenuItem) => {
    if (item.route) {
      navigate(item.route);
    }
  };

  const renderMenuItemCard = (item: MenuItem) => {
    const IconComponent = getIconComponent(item.icon);
    
    return (
      <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{item.label}</CardTitle>
              {item.children && item.children.length > 0 && (
                <CardDescription>{item.children.length} items</CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {item.children && item.children.length > 0 ? (
            <div className="space-y-2">
              {item.children.slice(0, 3).map((child) => {
                const ChildIconComponent = getIconComponent(child.icon);
                return (
                  <Button
                    key={child.id}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-8"
                    onClick={() => handleMenuClick(child)}
                  >
                    <ChildIconComponent className="h-4 w-4 mr-2" />
                    {child.label}
                  </Button>
                );
              })}
              {item.children.length > 3 && (
                <p className="text-sm text-muted-foreground pl-2">
                  +{item.children.length - 3} more
                </p>
              )}
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleMenuClick(item)}
            >
              Open
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMenuItemButton = (item: MenuItem) => {
    const IconComponent = getIconComponent(item.icon);
    
    return (
      <Button
        key={item.id}
        variant="ghost"
        className="flex items-center space-x-2 justify-start"
        onClick={() => handleMenuClick(item)}
      >
        <IconComponent className="h-4 w-4" />
        <span>{item.label}</span>
      </Button>
    );
  };

  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
        {menuItems.map(renderMenuItemCard)}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {menuItems.map(renderMenuItemButton)}
      </div>
    );
  }

  if (variant === "sidebar") {
    return (
      <nav className={`space-y-1 ${className}`}>
        {menuItems.map((item) => {
          const IconComponent = getIconComponent(item.icon);
          
          return (
            <div key={item.id}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => handleMenuClick(item)}
              >
                <IconComponent className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
              {item.children && item.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const ChildIconComponent = getIconComponent(child.icon);
                    return (
                      <Button
                        key={child.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left"
                        onClick={() => handleMenuClick(child)}
                      >
                        <ChildIconComponent className="h-3 w-3 mr-2" />
                        {child.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }

  // Default horizontal layout
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {menuItems.map(renderMenuItemButton)}
    </div>
  );
};

export default DynamicMenuRenderer;
