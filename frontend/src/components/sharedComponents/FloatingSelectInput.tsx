import React, { useRef } from "react";
import clsx from "clsx";
import { MdArrowDropDown } from "react-icons/md";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  size?: "small" | "medium" | "fullWidth";
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  helperText?: string;
  error?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

interface SelectProps extends InputProps {
  options: Option[];
}

interface Option {
  label: string;
  value: string;
}

const NormalTextInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  size = "medium",
  disabled = false,
  required = false,
  name,
  id,
  fullWidth = true,
  className,
  inputClassName,
  labelClassName,
  helperText,
  error = false,
  autoFocus = false,
  placeholder = "",
}) => {
  const sizeClasses: Record<string, string> = {
    small: "py-2 text-sm",
    medium: "py-3 text-base",
    fullWidth: "py-4 text-lg w-full",
  };

  return (
    <div
      className={clsx("relative z-0 my-4", fullWidth && "w-full", className)}
    >
      <div className="relative">
        <input
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={clsx(
            "peer block appearance-none bg-gray-100 border px-3 rounded-md",
            sizeClasses[size],
            "text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-500",
            {
              "border-gray-300 focus:border-blue-500": !error,
              "border-red-500 focus:border-red-500 text-red-600": error,
              "cursor-not-allowed bg-gray-200 text-gray-400": disabled,
              "w-full": fullWidth,
            },
            inputClassName
          )}
        />
      </div>

      <label
        htmlFor={id}
        className={clsx(
          "absolute -top-5 left-0 text-sm font-medium text-gray-700",
          error && "text-red-500",
          size === "small" && "text-xs",
          size === "medium" && "text-sm",
          size === "fullWidth" && "text-base",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {helperText && (
        <p
          className={clsx("mt-1 text-xs", {
            "text-gray-500": !error,
            "text-red-500": error,
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

const TextAreaInput: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  size = "medium",
  disabled = false,
  required = false,
  name,
  id,
  fullWidth = true,
  className,
  inputClassName,
  labelClassName,
  helperText,
  error = false,
  autoFocus = false,
  placeholder = "",
}) => {
  const sizeClasses: Record<string, string> = {
    small: "py-2 text-sm min-h-[60px]",
    medium: "py-3 text-base min-h-[80px]",
    fullWidth: "py-4 text-lg w-full min-h-[100px]",
  };

  return (
    <div
      className={clsx("relative z-0 my-4", fullWidth && "w-full", className)}
    >
      <div className="relative">
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={clsx(
            "peer block appearance-none bg-gray-100 border px-3 rounded-md",
            sizeClasses[size],
            "text-gray-900 focus:outline-none focus:ring-0 placeholder-gray-500 resize-none",
            {
              "border-gray-300 focus:border-blue-500": !error,
              "border-red-500 focus:border-red-500 text-red-600": error,
              "cursor-not-allowed bg-gray-200 text-gray-400": disabled,
              "w-full": fullWidth,
            },
            inputClassName
          )}
        />
      </div>

      <label
        htmlFor={id}
        className={clsx(
          "absolute -top-5 left-0 text-sm font-medium text-gray-700",
          error && "text-red-500",
          size === "small" && "text-xs",
          size === "medium" && "text-sm",
          size === "fullWidth" && "text-base",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {helperText && (
        <p
          className={clsx("mt-1 text-xs", {
            "text-gray-500": !error,
            "text-red-500": error,
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

const SelectInput: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  size = "medium",
  disabled = false,
  required = false,
  name,
  id,
  fullWidth = true,
  className,
  inputClassName,
  labelClassName,
  helperText,
  error = false,
  autoFocus = false,
  placeholder = "",
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const sizeClasses: Record<string, string> = {
    small: "py-2 text-sm pr-6",
    medium: "py-3 text-base pr-7",
    fullWidth: "py-4 text-lg w-full pr-8",
  };

  const iconSizeClasses: Record<string, string> = {
    small: "text-lg",
    medium: "text-xl",
    fullWidth: "text-2xl",
  };

  return (
    <div
      className={clsx("relative z-0 my-4", fullWidth && "w-full", className)}
    >
      <div className="relative">
        <select
          ref={selectRef}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={clsx(
            "peer block appearance-none bg-gray-100 border px-3 rounded-md",
            sizeClasses[size],
            "text-gray-900 focus:outline-none focus:ring-0",
            {
              "border-gray-300 focus:border-blue-500": !error,
              "border-red-500 focus:border-red-500 text-red-600": error,
              "cursor-not-allowed bg-gray-200 text-gray-400": disabled,
              "w-full": fullWidth,
            },
            value === "" && "text-gray-500",
            inputClassName
          )}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div
          className={clsx(
            "absolute right-0 top-0 pointer-events-none flex items-center h-full",
            size === "small" ? "w-6" : size === "medium" ? "w-7" : "w-8"
          )}
        >
          <MdArrowDropDown
            className={clsx("text-gray-400", iconSizeClasses[size])}
          />
        </div>
      </div>

      <label
        htmlFor={id}
        className={clsx(
          "absolute -top-5 left-0 text-sm font-medium text-gray-700",
          error && "text-red-500",
          size === "small" && "text-xs",
          size === "medium" && "text-sm",
          size === "fullWidth" && "text-base",
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      {helperText && (
        <p
          className={clsx("mt-1 text-xs", {
            "text-gray-500": !error,
            "text-red-500": error,
          })}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export { NormalTextInput, TextAreaInput, SelectInput };
