import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute"; //  make sure this is imported

import Dashboard from "../pages/Dashboard";
import Shipments from "../pages/Shipments";
import Users from "../pages/Users";
import Payments from "../pages/Payments";
import Reports from "../pages/Report";
import Customers from "../pages/Customers";
import AdminProfile from "../pages/AdminProfile";
import Branches from "../pages/Branches";
import Messages from "../pages/Messages";
import Agents from "../pages/Agents";
import ContentManagement from "../pages/ContentManagements";
import TrackingLogs from "../pages/TrackingLog";
import AuditLogs from "../pages/AuditLogs";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import ResetPassword from "../pages/ResetPassword";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/*  Public dashboard (for all admins) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SuperAdmin",
                "Admin",
                "BranchManager",
                "OperationsManager",
                "ITAdmin",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/*  Only SuperAdmin can access Users page */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        {/* ✅ All admins can create shipments */}
        <Route
          path="/shipments"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SuperAdmin",
                "Admin",
                "BranchManager",
                "OperationsManager",
                "ITAdmin",
              ]}
            >
              <Shipments />
            </ProtectedRoute>
          }
        />

        {/* ✅ Other pages with different roles */}
        <Route
          path="/customers"
          element={
            <ProtectedRoute
              allowedRoles={["SuperAdmin", "Admin", "BranchManager"]}
            >
              <Customers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SuperAdmin",
                "Admin",
                "BranchManager",
                "OperationsManager",
                "ITAdmin",
              ]}
            >
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "BranchManager"]}>
              <Branches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute
              allowedRoles={["SuperAdmin", "Admin", "BranchManager"]}
            >
              <Messages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/agents"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "BranchManager"]}>
              <Agents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/content-management"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "ITAdmin"]}>
              <ContentManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking-logs"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin", "Admin"]}>
              <TrackingLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["SuperAdmin"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["SuperAdmin", "Admin", "BranchManager", "ITAdmin"]}
            >
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SuperAdmin",
                "Admin",
                "BranchManager",
                "OperationsManager",
                "ITAdmin",
              ]}
            >
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <ProtectedRoute
              allowedRoles={[
                "SuperAdmin",
                "Admin",
                "BranchManager",
                "OperationsManager",
                "ITAdmin",
              ]}
            >
              <ResetPassword />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
