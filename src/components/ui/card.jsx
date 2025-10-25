import React from "react";

/**
 * A simple reusable Card component for wrapping dashboard content or UI blocks.
 * Use <Card> and <CardContent> together for consistent layout and spacing.
 */

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-500 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
