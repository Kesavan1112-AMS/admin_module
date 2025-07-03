
import { IconType } from 'react-icons';

export interface DropdownItemProps {
    icon: IconType;
    text: string;
    onClick: () => void;
  }
  
export interface ProfileDropdownProps {
    isOpen: boolean;
    onLogout: () => void;
    onChangePassword: () => void;
}