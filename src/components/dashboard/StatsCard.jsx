import { Card, CardContent } from "../ui/card";

export default function StatsCard({ title, value, icon: Icon }) {
  return (
    <Card className="shadow-md border-t-4 border-blue-700">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <h4 className="text-gray-700 text-sm font-semibold">{title}</h4>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="text-blue-700" size={32} />
      </CardContent>
    </Card>
  );
}
