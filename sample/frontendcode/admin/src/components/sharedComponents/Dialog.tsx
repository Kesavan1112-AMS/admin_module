import React, { forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type MaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | false;
interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: MaxWidth;
  fullScreen?: boolean;
  className?: string;
  contentClassName?: string;
  disableEscapeKeyDown?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

const getMaxWidthClasses = (maxWidth: MaxWidth) => {
  switch (maxWidth) {
    case "xs":
      return "max-w-xs";
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    default:
      return "max-w-2xl";
  }
};

interface CustomDialogContentTextProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const DialogContentText: React.FC<CustomDialogContentTextProps> = ({
  id,
  children,
  className,
}) => {
  return (
    <p id={id} className={clsx("text-gray-700 dark:text-gray-300", className)}>
      {children}
    </p>
  );
};

interface CustomDialogActionsProps {
  children: React.ReactNode;
  className?: string;
}

interface CustomDialogTitleProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

const DialogTitle: React.FC<CustomDialogTitleProps> = ({
  id,
  children,
  className,
}) => {
  return (
    <div
      id={id}
      className={clsx(
        "px-6 py-4 border-gray-200 dark:border-gray-700",
        "text-lg font-semibold text-gray-900 dark:text-white",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CustomDialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const DialogContent: React.FC<CustomDialogContentProps> = ({
  children,
  className,
}) => {
  return <div className={clsx("px-6 py-2", className)}>{children}</div>;
};

interface CustomDialogActionsProps {
  children: React.ReactNode;
  className?: string;
}

const DialogActions: React.FC<CustomDialogActionsProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "px-6 py-4 border-gray-200 dark:border-gray-700 flex justify-end space-x-2",
        className
      )}
    >
      {children}
    </div>
  );
};

const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      onClose,
      children,
      maxWidth = "md",
      fullScreen = false,
      className,
      contentClassName,
      disableEscapeKeyDown = false,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
    },
    ref
  ) => {
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && !disableEscapeKeyDown && open) {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose, disableEscapeKeyDown]);

    return (
      <AnimatePresence>
        {open && (
          <div
            className={clsx(
              "fixed inset-0 z-50 flex items-center justify-center",
              fullScreen ? "p-0" : "p-4"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
          >
            <motion.div
              className="fixed inset-0 bg-gray-800 bg-opacity-75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />
            <motion.div
              ref={ref}
              className={clsx(
                "relative bg-white dark:bg-gray-900 rounded-md shadow-xl",
                fullScreen ? "w-full h-full" : getMaxWidthClasses(maxWidth),
                fullScreen ? "m-0 rounded-none" : "m-4",
                className
              )}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={clsx("flex flex-col", contentClassName)}>
                {children}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);

export { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions };
