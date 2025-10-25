// src/components/shared/ErrorLoader.jsx
import React from "react";
import { Loader2, AlertTriangle } from "lucide-react";

const ErrorLoader = ({
  loading = false,
  error = "",
  children,
  className = "",
}) => {
  if (loading) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-gray-600 py-10 ${className}`}
      >
        <Loader2 size={28} className="animate-spin mb-2 text-blue-600" />
        <p className="text-sm">Loading, please wait...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-red-600 py-10 ${className}`}
      >
        <AlertTriangle size={28} className="mb-2 text-red-600" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  // Render normal content if not loading or error
  return <>{children}</>;
};

export default ErrorLoader;
