// src/components/shared/ErrorMessage.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorMessage = ({ message = "Something went wrong", className = "" }) => {
  if (!message) return null; // Don't render if no message provided

  return (
    <div
      className={`flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg ${className}`}
    >
      <AlertTriangle size={18} className="text-red-600" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
