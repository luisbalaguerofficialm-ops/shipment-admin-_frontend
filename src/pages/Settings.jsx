import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Mail, Lock, Bell, Shield, Users, X } from "lucide-react";
import toast from "react-hot-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const handleSwitchUser = (e) => {
    e.preventDefault();
    setShowSwitchModal(false);
    toast.success("User switched successfully!");
  };

  const handleDeactivate = () => {
    setConfirmDeactivate(false);
    toast.error("Your account has been deactivated.");
  };

  return (
    <div className="space-y-6 min-h-screen p-4 bg-gray-50 text-gray-800">
      <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>

      <Card className="max-w-2xl mx-auto shadow-md border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-8">
          {/* Admin Account Section */}
          <div>
            <h2 className="text-lg font-bold text-blue-700 mb-3">
              Admin Account
            </h2>
            <div className="flex flex-col items-start mb-2 space-y-3 mx-auto w-fit">
              {/* Email Field */}
              <div className="flex items-center border rounded-lg p-2 w-110 focus-within:ring focus-within:ring-blue-200">
                <Mail size={18} className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Admin Email"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>

              {/* Current Password */}
              <div className="flex items-center border rounded-lg p-2 w-110 focus-within:ring focus-within:ring-blue-200">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>

              {/* New Password */}
              <div className="flex items-center border rounded-lg p-2 w-110 focus-within:ring focus-within:ring-blue-200">
                <Lock size={18} className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 outline-none bg-transparent"
                />
              </div>

              {/* Update Password Button */}
              <button
                className="bg-blue-700 text-white rounded-lg py-2 px-4 hover:bg-blue-800 transition"
                onClick={() => toast.success("Password updated successfully!")}
              >
                Update Password
              </button>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Preferences Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">
              Preferences
            </h2>

            {/* Email Notifications */}
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600" size={18} />
              <label className="text-gray-600 flex-1">
                Email Notifications
              </label>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => {
                  setNotifications(!notifications);
                  toast.success(
                    notifications
                      ? "Notifications disabled"
                      : "Notifications enabled"
                  );
                }}
                className="w-5 h-5 accent-blue-700"
              />
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Security Section */}
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-3">Security</h2>
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-gray-600" size={18} />
              <label className="text-gray-600 flex-1">
                Enable Two-Factor Authentication
              </label>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={() => {
                  setTwoFactor(!twoFactor);
                  toast.success(
                    !twoFactor
                      ? "Two-Factor Authentication enabled"
                      : "Two-Factor Authentication disabled"
                  );
                }}
                className="w-5 h-5 accent-blue-700"
              />
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-gray-600" size={18} />
              <label className="text-gray-600 flex-1">
                Manage Active Sessions
              </label>
              <button className="text-blue-700 font-medium hover:underline">
                View
              </button>
            </div>
          </div>

          <hr className="my-4 border-gray-300" />

          {/* Danger Zone */}
          <div>
            <h2 className="text-lg font-semibold text-red-700 mb-2">
              Danger Zone
            </h2>
            <p className="text-gray-500 mb-3">
              Deactivate or switch user accounts carefully.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowSwitchModal(true)}
                className="bg-yellow-500 text-white rounded-lg py-2 px-4 hover:bg-yellow-600 transition"
              >
                Switch User
              </button>
              <button
                onClick={() => setConfirmDeactivate(true)}
                className="bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Switch User Modal */}
      {showSwitchModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 relative">
            <button
              onClick={() => setShowSwitchModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-semibold mb-4">Switch User Account</h3>
            <form onSubmit={handleSwitchUser} className="space-y-3">
              <input
                type="email"
                placeholder="Enter new user email"
                className="w-full border rounded-lg p-2 outline-none"
                required
              />
              <input
                type="password"
                placeholder="Admin password"
                className="w-full border rounded-lg p-2 outline-none"
                required
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white rounded-lg py-2 px-4 w-full hover:bg-yellow-600 transition"
              >
                Confirm Switch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Deactivate Prompt */}
      {confirmDeactivate && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-3 text-red-700">
              Confirm Deactivation
            </h3>
            <p className="text-gray-600 mb-5">
              Are you sure you want to deactivate your account?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeactivate}
                className="bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition"
              >
                Yes, Deactivate
              </button>
              <button
                onClick={() => setConfirmDeactivate(false)}
                className="bg-gray-400 text-white rounded-lg py-2 px-4 hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
