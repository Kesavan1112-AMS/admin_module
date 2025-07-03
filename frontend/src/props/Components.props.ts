import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";

export interface passwordProps {
  password: string;
  showPassword?: boolean;
  setShowPassword?: Dispatch<SetStateAction<boolean>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error: string | null;
  openEye?: string;
  closeEye?: string;
  inputClass?: string;
  labelClass?: string;
  buttonClass?: string;
}

export interface emaildProps {
  email: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void | undefined;
  error: string | null;
  label: string;
  inputClass?: string;
  labelClass?: string;
}

export interface GridLoaderProps {
  isLoading: boolean;
}

export interface BasicButtonProps {
  buttonClass: string;
  spanClass?: string;
  lable?: string;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: IconType;
}

export interface CardComponentProps {
  cardHeading: string;
  closeFunction?: () => void;
  clickOutsideClose?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface TextComponentProps {
  text: string;
  className?: string;
}

export interface ButtonComponentProps {
  buttonClass: string;
  spanClass?: string;
  lable?: string;
  type: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
