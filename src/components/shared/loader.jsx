// src/components/shared/ErrorLoader.jsx
import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import ScrollReveal from "scrollreveal";
import loadingImg from "../../assets/Shipping-company-logo (1).jpg"; // <-- Your loading image path

const ErrorLoader = ({
  loading = false,
  error = "",
  children,
  className = "",
}) => {
  const loaderRef = useRef(null);

  useEffect(() => {
    if (loaderRef.current) {
      ScrollReveal().reveal(loaderRef.current, {
        duration: 1000,
        origin: "bottom",
        distance: "20px",
        easing: "ease-in-out",
        reset: true, // animation repeats when scrolled back into view
      });
    }
  }, []);

  if (loading) {
    return (
      <div
        ref={loaderRef}
        className={`flex flex-col items-center justify-center text-gray-600 py-10 ${className}`}
      >
        {/* Rotating image */}
        <img
          src={loadingImg}
          alt="Loading..."
          className="w-12 h-12 mb-2 animate-spin-smooth"
        />
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

  return <>{children}</>;
};

export default ErrorLoader;
