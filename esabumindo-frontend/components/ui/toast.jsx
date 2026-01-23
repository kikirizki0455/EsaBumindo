/**
 * Toast Notification Component
 * Menampilkan notifikasi di bagian atas halaman
 */

import React, { useContext } from "react";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader,
} from "lucide-react";
import { ToastContext } from "./toast-context";

const Toast = () => {
  const context = useContext(ToastContext);

  if (!context || !context.toasts || context.toasts.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <AlertCircle size={20} className="text-red-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case "loading":
        return <Loader size={20} className="text-blue-600 animate-spin" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-900";
      case "error":
        return "bg-red-50 border-red-200 text-red-900";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "loading":
        return "bg-blue-50 border-blue-200 text-blue-900";
      default:
        return "bg-blue-50 border-blue-200 text-blue-900";
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
      {context.toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm animate-in fade-in slide-in-from-top-2 transition-all ${getStyles(
            toast.type
          )}`}
          role="alert"
        >
          <div className="shrink-0 mt-0.5">{getIcon(toast.type)}</div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          {toast.type !== "loading" && (
            <button
              onClick={() => context.removeToast(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
