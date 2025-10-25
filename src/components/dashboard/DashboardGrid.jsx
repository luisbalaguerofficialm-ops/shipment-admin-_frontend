import StatsCard from "./StatsCard";
import { Package, Users, CreditCard, BarChart3 } from "lucide-react";

const stats = [
  { title: "Total Shipments", value: "1,234", icon: Package },
  { title: "Registered Users", value: "560", icon: Users },
  { title: "Payments Processed", value: "$72,480", icon: CreditCard },
  { title: "Pending Deliveries", value: "87", icon: BarChart3 },
];

export default function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((s) => (
        <StatsCard key={s.title} {...s} />
      ))}
    </div>
  );
}
