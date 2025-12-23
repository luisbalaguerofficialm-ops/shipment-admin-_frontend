import React, { useEffect, useState, useRef } from "react";
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
import { io } from "socket.io-client";

const BACKEND_URL = "https://admin-ship-backend.onrender.com";

const ContentManagements = () => {
  const [content, setContent] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const socketRef = useRef(null);
  const token = localStorage.getItem("authToken");

  // ================= FETCH CONTENT =================
  const fetchContent = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/contents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success && data.contents.length > 0) {
        setContent(data.contents[0]);
      }
    } catch (err) {
      console.error("Fetch content error:", err);
      toast.error("Failed to load content");
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchContent();

    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    socketRef.current.on("contentUpdated", (updated) => {
      if (!updated) return;
      setContent(updated);
      toast.success("Content updated live");
    });

    return () => socketRef.current?.disconnect();
  }, []);

  // ================= SAVE CONTENT =================
  const handleSave = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/contents/${content._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Failed to update content");
        return;
      }

      setEditingSection(null);
      toast.success("Content saved");
    } catch (err) {
      console.error("Save content error:", err);
      toast.error("Network error");
    }
  };

  if (!content) {
    return <p className="text-gray-500">Loading content...</p>;
  }

  // ================= UI =================
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Content Management
      </h1>

      <Card className="shadow-md border">
        <CardContent className="p-6 space-y-8">
          {/*  Homepage Banner */}
          <Section
            title="Homepage Banner"
            icon={<Globe size={18} />}
            field="homepageBanner"
            content={content}
            setContent={setContent}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onSave={handleSave}
          />

          <Section
            title="Services Information"
            icon={<Info size={18} />}
            field="servicesInfo"
            content={content}
            setContent={setContent}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onSave={handleSave}
          />

          <Section
            title="FAQs"
            icon={<FileText size={18} />}
            field="faqs"
            textarea
            content={content}
            setContent={setContent}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onSave={handleSave}
          />

          <Section
            title="Privacy Policy"
            icon={<ShieldCheck size={18} />}
            field="privacyPolicy"
            textarea
            content={content}
            setContent={setContent}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onSave={handleSave}
          />

          <Section
            title="Announcements"
            icon={<Speaker size={18} />}
            field="announcements"
            content={content}
            setContent={setContent}
            editingSection={editingSection}
            setEditingSection={setEditingSection}
            onSave={handleSave}
          />
        </CardContent>
      </Card>
    </div>
  );
};

// ================= REUSABLE SECTION =================
const Section = ({
  title,
  icon,
  field,
  content,
  setContent,
  editingSection,
  setEditingSection,
  onSave,
  textarea,
}) => {
  const isEditing = editingSection === field;

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h2 className="text-lg font-bold text-blue-700 flex items-center gap-2">
          {icon} {title}
        </h2>

        {isEditing ? (
          <button
            onClick={onSave}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg"
          >
            <Save size={16} /> Save
          </button>
        ) : (
          <button
            onClick={() => setEditingSection(field)}
            className="flex items-center gap-1 text-blue-700"
          >
            <Edit size={16} /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          className="w-full border rounded-lg p-2"
          rows={textarea ? 6 : 3}
          value={content[field] || ""}
          onChange={(e) => setContent({ ...content, [field]: e.target.value })}
        />
      ) : (
        <p className="text-gray-600 whitespace-pre-wrap">{content[field]}</p>
      )}
    </div>
  );
};

export default ContentManagements;
