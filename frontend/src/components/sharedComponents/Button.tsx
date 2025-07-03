import React, { useContext } from "react";
import clsx from "clsx";

interface Theme {
  variants: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

const ThemeContext = React.createContext<Theme | undefined>(undefined);

type Size = "small" | "medium" | "large";
type Variant = "contained" | "outlined" | "text" | "link" | "icon-only";
type Color = "primary" | "secondary" | "success" | "error" | "warning" | "info";
type Shape = "rounded" | "square" | "circle";

interface ButtonProps {
  children?: React.ReactNode;
  size?: Size;
  variant?: Variant;
  color?: Color;
  shape?: Shape;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  disabled?: boolean;
  fullWidth?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  tooltip?: string;
  component?: React.ElementType;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => void;
  className?: string;
  [key: string]: any;
}

const baseStyles =
  "inline-flex items-center justify-center font-sans font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-100";

const sizeStyles = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-4 py-2 text-base",
  large: "px-5 py-3 text-lg",
};

const variantStyles = {
  contained: {
    primary:
      "bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-400 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700 dark:focus:ring-teal-500",
    secondary:
      "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-500",
    success:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400 dark:bg-green-600 dark:text-white dark:hover:bg-green-700 dark:focus:ring-green-500",
    error:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 dark:bg-red-600 dark:text-white dark:hover:bg-red-700 dark:focus:ring-red-500",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400 dark:bg-yellow-600 dark:text-white dark:hover:bg-yellow-700 dark:focus:ring-yellow-500",
    info: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-400 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700 dark:focus:ring-teal-500",
  },
  outlined: {
    primary:
      "border border-teal-400 text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:border-teal-600 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
    secondary:
      "border border-gray-400 text-gray-400 hover:bg-gray-900/20 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-600 dark:hover:bg-gray-50 dark:focus:ring-gray-500",
    success:
      "border border-green-400 text-green-400 hover:bg-green-900/20 focus:ring-green-400 dark:border-green-600 dark:text-green-600 dark:hover:bg-green-50 dark:focus:ring-green-500",
    error:
      "border border-red-400 text-red-400 hover:bg-red-900/20 focus:ring-red-400 dark:border-red-600 dark:text-red-600 dark:hover:bg-red-50 dark:focus:ring-red-500",
    warning:
      "border border-yellow-400 text-yellow-400 hover:bg-yellow-900/20 focus:ring-yellow-400 dark:border-yellow-600 dark:text-yellow-600 dark:hover:bg-yellow-50 dark:focus:ring-yellow-500",
    info: "border border-teal-400 text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:border-teal-600 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
  },
  text: {
    primary:
      "text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
    secondary:
      "text-gray-400 hover:bg-gray-900/20 focus:ring-gray-400 dark:text-gray-600 dark:hover:bg-gray-50 dark:focus:ring-gray-500",
    success:
      "text-green-400 hover:bg-green-900/20 focus:ring-green-400 dark:text-green-600 dark:hover:bg-green-50 dark:focus:ring-green-500",
    error:
      "text-red-400 hover:bg-red-900/20 focus:ring-red-400 dark:text-red-600 dark:hover:bg-red-50 dark:focus:ring-red-500",
    warning:
      "text-yellow-400 hover:bg-yellow-900/20 focus:ring-yellow-400 dark:text-yellow-600 dark:hover:bg-yellow-50 dark:focus:ring-yellow-500",
    info: "text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
  },
  link: {
    primary:
      "text-teal-400 hover:underline focus:ring-teal-400 dark:text-teal-600 dark:hover:underline dark:focus:ring-teal-500",
    secondary:
      "text-gray-400 hover:underline focus:ring-gray-400 dark:text-gray-600 dark:hover:underline dark:focus:ring-gray-500",
    success:
      "text-green-400 hover:underline focus:ring-green-400 dark:text-green-600 dark:hover:underline dark:focus:ring-green-500",
    error:
      "text-red-400 hover:underline focus:ring-red-400 dark:text-red-600 dark:hover:underline dark:focus:ring-red-500",
    warning:
      "text-yellow-400 hover:underline focus:ring-yellow-400 dark:text-yellow-600 dark:hover:underline dark:focus:ring-yellow-500",
    info: "text-teal-400 hover:underline focus:ring-teal-400 dark:text-teal-600 dark:hover:underline dark:focus:ring-teal-500",
  },
  "icon-only": {
    primary:
      "p-2 text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
    secondary:
      "p-2 text-gray-400 hover:bg-gray-900/20 focus:ring-gray-400 dark:text-gray-600 dark:hover:bg-gray-50 dark:focus:ring-gray-500",
    success:
      "p-2 text-green-400 hover:bg-green-900/20 focus:ring-green-400 dark:text-green-600 dark:hover:bg-green-50 dark:focus:ring-green-500",
    error:
      "p-2 text-red-400 hover:bg-red-900/20 focus:ring-red-400 dark:text-red-600 dark:hover:bg-red-50 dark:focus:ring-red-500",
    warning:
      "p-2 text-yellow-400 hover:bg-yellow-900/20 focus:ring-yellow-400 dark:text-yellow-600 dark:hover:bg-yellow-50 dark:focus:ring-yellow-500",
    info: "p-2 text-teal-400 hover:bg-teal-900/20 focus:ring-teal-400 dark:text-teal-600 dark:hover:bg-teal-50 dark:focus:ring-teal-500",
  },
};

const shapeStyles = {
  rounded: "rounded-md",
  square: "rounded-none",
  circle: "rounded-full",
};

const iconSize = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
};

const Button: React.FC<ButtonProps> = React.memo(
  ({
    children,
    size = "medium",
    variant = "contained",
    color = "primary",
    shape = "rounded",
    startIcon = null,
    endIcon = null,
    disabled = false,
    fullWidth = false,
    href,
    target,
    rel,
    tooltip,
    component: Component = href ? "a" : "button",
    onClick,
    className = "",
    buttonRef,
    ...props
  }) => {
    const theme = useContext(ThemeContext) || { variants: variantStyles };
    const buttonStyles = clsx(
      baseStyles,
      sizeStyles[size],
      theme.variants[variant][color],
      shapeStyles[shape],
      fullWidth && "w-full",
      disabled && "opacity-50 cursor-not-allowed",
      className
    );

    const iconSpacing = clsx(
      children && (size === "small" ? "mr-1.5" : "mr-2")
    );
    const endIconSpacing = clsx(
      children && (size === "small" ? "ml-1.5" : "ml-2")
    );

    const buttonContent = (
      <Component
        className={buttonStyles}
        onClick={onClick}
        disabled={disabled}
        href={href}
        target={target}
        rel={rel}
        role={href ? undefined : "button"}
        aria-disabled={disabled}
        aria-label={tooltip || (children ? undefined : "Button")}
        ref={buttonRef}
        {...props}
      >
        {startIcon && (
          <span className={clsx(iconSpacing, iconSize[size])}>{startIcon}</span>
        )}
        {children}
        {endIcon && (
          <span className={clsx(endIconSpacing, iconSize[size])}>
            {endIcon}
          </span>
        )}
      </Component>
    );

    return tooltip ? (
      <div className="relative group">
        {buttonContent}
        <span className="z-50 absolute hidden group-hover:block w-max px-3 py-1 text-[10px] text-white bg-gray-600 rounded-md dark:bg-gray-800 dark:text-white top-full left-1/2 -translate-x-1/2 mt-2">
          {tooltip}
        </span>
      </div>
    ) : (
      buttonContent
    );
  }
);

export default Button;