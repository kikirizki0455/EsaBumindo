/**
 * Toast Notification Context dan Provider
 * Untuk menampilkan notifikasi di seluruh aplikasi
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  X,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader,
} from "lucide-react";

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    toasts,
    addToast,
    removeToast,
    success: (message, duration) => addToast(message, "success", duration),
    error: (message, duration) => addToast(message, "error", duration),
    warning: (message, duration) => addToast(message, "warning", duration),
    info: (message, duration) => addToast(message, "info", duration),
    loading: (message) => addToast(message, "loading", 0),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan dalam ToastProvider");
  }
  return context;
};

// Toast Component
const Toast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    return null;
  }

  const { toasts, removeToast } = context;

  const getToastStyles = (type) => {
    const baseStyles =
      "flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-top-2 duration-300";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-200`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-200`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-200`;
      case "info":
        return `${baseStyles} bg-blue-50 border-blue-200`;
      case "loading":
        return `${baseStyles} bg-blue-50 border-blue-200`;
      default:
        return baseStyles;
    }
  };

  const getIconStyles = (type) => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      case "info":
      case "loading":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getMessageStyles = (type) => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      case "info":
      case "loading":
        return "text-blue-800";
      default:
        return "text-gray-800";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle
            size={20}
            className={`shrink-0 ${getIconStyles(type)}`}
          />
        );
      case "error":
        return (
          <AlertCircle
            size={20}
            className={`shrink-0 ${getIconStyles(type)}`}
          />
        );
      case "warning":
        return (
          <AlertTriangle
            size={20}
            className={`shrink-0 ${getIconStyles(type)}`}
          />
        );
      case "info":
        return <Info size={20} className={`shrink-0 ${getIconStyles(type)}`} />;
      case "loading":
        return (
          <Loader
            size={20}
            className={`shrink-0 ${getIconStyles(type)} animate-spin`}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} pointer-events-auto`}
        >
          <div className="flex-shrink-0">{getIcon(toast.type)}</div>
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${getMessageStyles(toast.type)}`}
            >
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
