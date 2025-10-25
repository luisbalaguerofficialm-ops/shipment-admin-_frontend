import React from "react";
import DashboardGrid from "../components/dashboard/DashboardGrid";

const Dashboard = () => {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <DashboardGrid />
      </div>
    </div>
  );
};

export default Dashboard;
