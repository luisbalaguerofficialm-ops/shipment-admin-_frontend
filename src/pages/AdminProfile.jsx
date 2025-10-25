import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  User,
  Mail,
  Lock,
  Save,
  Camera,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    name: "Super Admin",
    email: "admin@courierpro.com",
    password: "",
    profilePic: null,
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdmin({ ...admin, profilePic: URL.createObjectURL(file) });
    }
  };

  // Handle save
  const handleSave = (e) => {
    e.preventDefault();
    alert("✅ Profile updated successfully!");
  };

  // Confirm password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!confirmPassword.trim()) {
      alert("Please enter a new password");
      return;
    }
    setAdmin({ ...admin, password: confirmPassword });
    setConfirmPassword("");
    setShowPasswordModal(false);
    alert("🔐 Password changed successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] bg-gray-50 relative">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
          Admin Profile
        </h1>

        <Card className="shadow-lg border border-gray-200 bg-white rounded-2xl">
          <CardContent className="p-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-28 h-28">
                <img
                  src={
                    admin.profilePic ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
                />
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer"
                >
                  <Camera size={16} />
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-800">
                {admin.name}
              </h2>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>

            {/* Profile Info */}
            <form onSubmit={handleSave} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <User size={18} className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="name"
                    value={admin.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Email
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2">
                  <Mail size={18} className="text-gray-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={admin.email}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="flex items-center border rounded-lg px-3 py-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Lock size={18} className="text-gray-500" />
                    <span className="text-gray-600">********</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(true)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="bg-blue-700 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-800 transition w-full"
              >
                <Save size={18} /> Save Changes
              </button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-[400px] p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevents background click from closing modal
          >
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XCircle size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Lock size={18} /> Change Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="Enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded-lg p-2 outline-none text-gray-900"
                autoFocus
              />

              <button
                type="submit"
                className="bg-green-600 text-white w-full py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
              >
                <CheckCircle size={18} /> Confirm Change
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
