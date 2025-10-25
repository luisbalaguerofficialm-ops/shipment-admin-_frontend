import React from "react";

/**
 * A simple, reusable Button component for your dashboard.
 * Supports different variants: "primary", "secondary", and "outline".
 */
export function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
}) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className} px-4 py-2`}
    >
      {children}
    </button>
  );
}

/**
 * Optional: Button with icon (for notifications, menu, etc.)
 */
export function ButtonIcon({ icon: Icon, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full hover:bg-gray-100 transition ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 text-gray-600" />}
    </button>
  );
}
