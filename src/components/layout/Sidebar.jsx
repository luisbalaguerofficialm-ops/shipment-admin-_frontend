import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  BarChart3,
  MapPin,
  MessageSquare,
  UserCog,
  FileText,
  Map,
  ClipboardList,
  Bell,
  Settings,
  UserCircle2,
  UsersRound,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    // ✅ Get the logged-in admin's role from localStorage
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin && storedAdmin.role) {
      setRole(storedAdmin.role);
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // ✅ Menu items definition
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Shipments", icon: Package },
    // 👇 Hide "Users" unless SuperAdmin
    ...(role === "SuperAdmin" ? [{ name: "Users", icon: Users }] : []),
    { name: "Customers", icon: UsersRound },
    { name: "Payments", icon: CreditCard },
    { name: "Reports", icon: BarChart3 },
    { name: "Branches", icon: MapPin },
    { name: "Messages", icon: MessageSquare },
    { name: "Agents", icon: UserCog },
    { name: "Content Management", icon: FileText },
    { name: "Tracking Logs", icon: Map },
    { name: "Audit Logs", icon: ClipboardList },
    { name: "Notifications", icon: Bell },
    { name: "Admin Profile", icon: UserCircle2 },
    { name: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* 🔹 Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 p-2 rounded-lg text-white focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 🔹 Sidebar container */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header / Logo */}
        <div className="px-6 py-6 text-2xl font-bold border-b border-blue-700">
          Online Admin
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map(({ name, icon: Icon }) => {
            const path = name.toLowerCase().replace(/\s+/g, "-");
            return (
              <NavLink
                key={name}
                to={`/${path}`}
                onClick={() => {
                  setActive(name);
                  setIsOpen(false); // close on mobile
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition ${
                    isActive || active === name
                      ? "bg-blue-700"
                      : "hover:bg-blue-700"
                  }`
                }
              >
                <Icon size={18} />
                <span>{name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue-700 text-sm text-blue-100">
          © 2025 Online Courier
        </div>
      </aside>

      {/* 🔹 Background overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
        ></div>
      )}
    </>
  );
}
