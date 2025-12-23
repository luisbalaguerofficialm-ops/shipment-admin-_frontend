// src/components/DashboardGrid.jsx
import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { Package, Users, CreditCard, BarChart3 } from "lucide-react";
import io from "socket.io-client";
import { toast } from "react-toastify";

export default function DashboardGrid() {
  const [stats, setStats] = useState({
    shipments: 0,
    users: 0,
    payments: 0,
    pendingDeliveries: 0,
  });

  const token = localStorage.getItem("authToken");

  // Fetch initial stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "https://admin-ship-backend.onrender.com/api/dashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          toast.error(data.message || "Failed to fetch dashboard stats");
          return;
        }

        setStats(data.stats);
        toast.success("Dashboard stats loaded!");
      } catch (err) {
        console.error("NETWORK ERROR:", err);
        toast.error("Network error while fetching dashboard stats!");
      }
    };

    fetchStats();
  }, [token]);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = io("https://admin-ship-backend.onrender.com", {
      transports: ["websocket"],
      auth: { token },
    });

    console.log("📡 Connected to dashboard socket");

    socket.on("dashboard:update", (data) => {
      console.log("📊 Live update received:", data);
      setStats({
        shipments: data.shipments,
        users: data.users,
        payments: data.payments,
        pendingDeliveries: data.pendingDeliveries,
      });
      toast.info("Dashboard stats updated!");
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      toast.error("Dashboard live updates disconnected!");
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Dashboard socket disconnected");
    };
  }, [token]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatsCard
        title="Total Shipments"
        value={stats.shipments}
        icon={Package}
      />
      <StatsCard title="Registered Users" value={stats.users} icon={Users} />
      <StatsCard
        title="Payments Processed"
        value={`$${Number(stats.payments).toLocaleString()}`}
        icon={CreditCard}
      />
      <StatsCard
        title="Pending Deliveries"
        value={stats.pendingDeliveries}
        icon={BarChart3}
      />
    </div>
  );
}
