import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Mail, Lock, Bell, Shield, X } from "lucide-react";
import toast from "react-hot-toast";

/* =========================
   MAIN SETTINGS COMPONENT
========================= */
const Settings = ({ token }) => {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  /* =========================
     FETCH SETTINGS
  ========================= */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(
          "https://admin-ship-backend.onrender.com/api/settings",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        if (data.success) {
          setNotifications(data.admin.notifications);
          setTwoFactor(data.admin.twoFactorEnabled);
          setAdminEmail(data.admin.email);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      }
    };

    fetchSettings();
  }, [token]);

  /* =========================
     ACTION HANDLERS
  ========================= */
  const updateEmail = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/settings/email",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: adminEmail }),
        }
      );

      const data = await res.json();
      data.success ? toast.success("Email updated") : toast.error(data.message);
    } catch {
      toast.error("Error updating email");
    }
  };

  const toggleNotifications = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/settings/notifications",
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        toast.success(
          data.notifications
            ? "Notifications enabled"
            : "Notifications disabled"
        );
      }
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const toggleTwoFactor = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/settings/twofactor",
        { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (data.success) {
        setTwoFactor(data.twoFactor);
        toast.success(data.twoFactor ? "2FA enabled" : "2FA disabled");
      }
    } catch {
      toast.error("Failed to update 2FA");
    }
  };

  const switchUser = async (email, password) => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/settings/switchuser",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      data.success ? toast.success(data.message) : toast.error(data.message);
      setShowSwitchModal(false);
    } catch {
      toast.error("Switch user failed");
    }
  };

  const deactivateAccount = async () => {
    try {
      const res = await fetch(
        "https://admin-ship-backend.onrender.com/api/settings/deactivate",
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      data.success ? toast.success(data.message) : toast.error(data.message);
      setShowDeactivateModal(false);
    } catch {
      toast.error("Failed to deactivate account");
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="space-y-8 p-6">
          <h1 className="text-2xl font-semibold">Settings</h1>

          <AdminAccount
            adminEmail={adminEmail}
            setAdminEmail={setAdminEmail}
            updateEmail={updateEmail}
            switchUser={() => setShowSwitchModal(true)}
          />

          <Preferences
            notifications={notifications}
            twoFactor={twoFactor}
            toggleNotifications={toggleNotifications}
            toggleTwoFactor={toggleTwoFactor}
          />

          <DangerZone
            onSwitch={() => setShowSwitchModal(true)}
            onDeactivate={() => setShowDeactivateModal(true)}
          />
        </CardContent>
      </Card>

      {/* MODALS */}
      {showSwitchModal && (
        <SwitchUserModal
          onClose={() => setShowSwitchModal(false)}
          onSubmit={switchUser}
        />
      )}

      {showDeactivateModal && (
        <ConfirmModal
          title="Deactivate Account?"
          message="This action cannot be undone."
          confirmText="Deactivate"
          danger
          onConfirm={deactivateAccount}
          onClose={() => setShowDeactivateModal(false)}
        />
      )}
    </div>
  );
};

/* =========================
   REUSABLE COMPONENTS
========================= */

const AdminAccount = ({ adminEmail, setAdminEmail, updateEmail }) => (
  <section>
    <h2 className="font-semibold text-blue-700 mb-3">Admin Account</h2>
    <div className="space-y-3">
      <div className="flex items-center border rounded-lg p-2">
        <Mail size={18} className="mr-2 text-gray-500" />
        <input
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
          className="flex-1 outline-none"
          placeholder="Admin email"
        />
      </div>
      <button
        onClick={updateEmail}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Email
      </button>
    </div>
  </section>
);

const Preferences = ({
  notifications,
  twoFactor,
  toggleNotifications,
  toggleTwoFactor,
}) => (
  <section>
    <h2 className="font-semibold mb-3">Preferences & Security</h2>

    <Toggle
      icon={<Bell size={18} />}
      label="Email Notifications"
      checked={notifications}
      onChange={toggleNotifications}
    />

    <Toggle
      icon={<Shield size={18} />}
      label="Two-Factor Authentication"
      checked={twoFactor}
      onChange={toggleTwoFactor}
    />
  </section>
);

const DangerZone = ({ onSwitch, onDeactivate }) => (
  <section>
    <h2 className="text-red-600 font-semibold mb-3">Danger Zone</h2>
    <div className="flex gap-4">
      <button
        onClick={onSwitch}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Switch User
      </button>
      <button
        onClick={onDeactivate}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Deactivate Account
      </button>
    </div>
  </section>
);

/* =========================
   MODALS
========================= */

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 relative">
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500"
      >
        <X size={18} />
      </button>
      {children}
    </div>
  </div>
);

const SwitchUserModal = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Modal onClose={onClose}>
      <h3 className="font-semibold mb-4">Switch User</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(email, password);
        }}
        className="space-y-3"
      >
        <input
          className="w-full border p-2 rounded"
          placeholder="User email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Admin password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-yellow-500 text-white w-full py-2 rounded">
          Confirm Switch
        </button>
      </form>
    </Modal>
  );
};

const ConfirmModal = ({
  title,
  message,
  confirmText,
  danger,
  onConfirm,
  onClose,
}) => (
  <Modal onClose={onClose}>
    <h3 className={`font-semibold mb-2 ${danger && "text-red-600"}`}>
      {title}
    </h3>
    <p className="mb-4 text-gray-600">{message}</p>
    <div className="flex gap-3">
      <button
        onClick={onConfirm}
        className={`flex-1 py-2 rounded ${
          danger ? "bg-red-600" : "bg-blue-600"
        } text-white`}
      >
        {confirmText}
      </button>
      <button onClick={onClose} className="flex-1 py-2 rounded bg-gray-300">
        Cancel
      </button>
    </div>
  </Modal>
);

const Toggle = ({ icon, label, checked, onChange }) => (
  <div className="flex items-center gap-3 mb-3">
    {icon}
    <span className="flex-1">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-5 h-5 accent-blue-600"
    />
  </div>
);

export default Settings;
