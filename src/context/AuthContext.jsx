import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    const savedAdmin = JSON.parse(localStorage.getItem("admin"));
    const savedRole = localStorage.getItem("role");

    if (savedAdmin) setAdmin(savedAdmin);
    if (savedRole) setRole(savedRole);
  }, []);

  const loginAdmin = (data) => {
    localStorage.setItem("admin", JSON.stringify(data.admin));
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("role", data.admin.role);

    setAdmin(data.admin);
    setRole(data.admin.role);
  };

  const logoutAdmin = () => {
    localStorage.clear();
    setAdmin(null);
    setRole("");
  };

  return (
    <AuthContext.Provider value={{ admin, role, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
