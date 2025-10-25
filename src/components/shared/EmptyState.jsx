// src/components/shared/EmptyState.jsx
import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon = Inbox,
  title = "No Data Available",
  message = "There’s nothing to display here yet.",
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-gray-50 rounded-2xl border border-gray-200">
      {/* Icon */}
      <div className="bg-blue-100 p-4 rounded-full mb-4">
        <Icon size={36} className="text-blue-700" />
      </div>

      {/* Text */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 max-w-sm mb-6">{message}</p>

      {/* Optional action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-blue-700 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
