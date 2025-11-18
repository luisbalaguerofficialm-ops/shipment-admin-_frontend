import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { Package, Users, CreditCard, BarChart3 } from "lucide-react";
import io from "socket.io-client";

const API_URL =
  import.meta.env.VITE_API_URL || "https://admin-ship-backend.onrender.com";

export default function DashboardGrid() {
  const [stats, setStats] = useState({
    shipments: 0,
    users: 0,
    payments: 0,
    pendingDeliveries: 0,
  });

  // Fetch initial stats once
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`);
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Socket.IO for real-time updates
  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("authToken") },
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
    });

    return () => {
      socket.disconnect();
      console.log("🔌 Dashboard socket disconnected");
    };
  }, []);

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
