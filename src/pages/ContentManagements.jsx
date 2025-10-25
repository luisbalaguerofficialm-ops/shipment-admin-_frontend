import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Edit,
  Save,
  Globe,
  Info,
  FileText,
  Speaker,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

const ContentManagements = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [content, setContent] = useState({
    homepageBanner: "Fast and reliable delivery services across the globe.",
    servicesInfo:
      "We provide same-day, international, and express courier options.",
    faqs: "Q: How do I track my shipment?\nA: Use your tracking ID on the tracking page.",
    privacyPolicy: "We respect your privacy and ensure your data is protected.",
    announcements:
      "Holiday Shipping Notice: Expect slight delivery delays during the festive period.",
  });

  const handleSave = () => {
    setEditingSection(null);
    toast.success("Content updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Content Management
      </h1>

      <Card className="shadow-md border border-gray-200 bg-white">
        <CardContent className="p-6 space-y-8">
          {/* 🌍 Homepage Banner */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <Globe size={18} /> Homepage Banner
              </h2>
              {editingSection === "banner" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingSection("banner")}
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
            {editingSection === "banner" ? (
              <textarea
                className="w-full border rounded-lg p-2 h-20 bg-white border-gray-300 text-gray-800"
                value={content.homepageBanner}
                onChange={(e) =>
                  setContent({ ...content, homepageBanner: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-600">{content.homepageBanner}</p>
            )}
          </div>

          <hr className="border-gray-300" />

          {/* 🧾 Services Info */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <Info size={18} /> Services Information
              </h2>
              {editingSection === "services" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingSection("services")}
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
            {editingSection === "services" ? (
              <textarea
                className="w-full border rounded-lg p-2 h-20 bg-white border-gray-300 text-gray-800"
                value={content.servicesInfo}
                onChange={(e) =>
                  setContent({ ...content, servicesInfo: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-600">{content.servicesInfo}</p>
            )}
          </div>

          <hr className="border-gray-300" />

          {/* 📋 FAQs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <FileText size={18} /> FAQs
              </h2>
              {editingSection === "faqs" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingSection("faqs")}
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
            {editingSection === "faqs" ? (
              <textarea
                className="w-full border rounded-lg p-2 h-24 bg-white border-gray-300 text-gray-800"
                value={content.faqs}
                onChange={(e) =>
                  setContent({ ...content, faqs: e.target.value })
                }
              />
            ) : (
              <pre className="text-gray-600 whitespace-pre-wrap">
                {content.faqs}
              </pre>
            )}
          </div>

          <hr className="border-gray-300" />

          {/* 🔒 Privacy Policy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <ShieldCheck size={18} /> Privacy Policy
              </h2>
              {editingSection === "privacy" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingSection("privacy")}
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
            {editingSection === "privacy" ? (
              <textarea
                className="w-full border rounded-lg p-2 h-24 bg-white border-gray-300 text-gray-800"
                value={content.privacyPolicy}
                onChange={(e) =>
                  setContent({ ...content, privacyPolicy: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-600">{content.privacyPolicy}</p>
            )}
          </div>

          <hr className="border-gray-300" />

          {/* 📢 Announcements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                <Speaker size={18} /> Announcements
              </h2>
              {editingSection === "announcement" ? (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                >
                  <Save size={16} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingSection("announcement")}
                  className="flex items-center gap-1 text-blue-700 hover:underline"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
            {editingSection === "announcement" ? (
              <textarea
                className="w-full border rounded-lg p-2 h-20 bg-white border-gray-300 text-gray-800"
                value={content.announcements}
                onChange={(e) =>
                  setContent({ ...content, announcements: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-600">{content.announcements}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagements;
