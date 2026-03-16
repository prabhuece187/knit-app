import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Package,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useGetDashboardQuery } from "@/api/DashboardApi";

export default function Dashboard() {
  const { data, isLoading } = useGetDashboardQuery();

  if (isLoading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const summary = data?.summary;
  const productionData = data?.production_chart?.map((item) => ({
    day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    production: item.total,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back 👋</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm">Total Customers</p>
              <h2 className="text-3xl font-bold">
                {summary?.total_customers ?? 0}
              </h2>
            </div>
            <Users size={40} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm">Production Today</p>
              <h2 className="text-3xl font-bold">
                {summary?.today_inward_weight ?? 0} Kg
              </h2>
            </div>
            <Package size={40} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm">Dispatch Today</p>
              <h2 className="text-3xl font-bold">
                {summary?.today_dispatch ?? 0} Kg
              </h2>
            </div>
            <TrendingUp size={40} />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm">Today's Collection</p>
              <h2 className="text-3xl font-bold">
                ₹{summary?.today_collection ?? 0}
              </h2>
            </div>
            <Wallet size={40} />
          </CardContent>
        </Card>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* PRODUCTION CHART */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Production Overview</h2>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={productionData} barCategoryGap="40%">
                <defs>
                  <linearGradient
                    id="collectionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.95} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <Tooltip />

                <Bar
                  dataKey="production"
                  fill="url(#collectionGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ALERT PANEL */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={18} /> Alerts
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-100 text-red-700">
                ⚠ Pending Dispatch Orders
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-100 text-yellow-700">
                ⚠ Pending Payments
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-100 text-blue-700">
                ℹ New Orders Received
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECENT ACTIVITIES */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-5">Recent Activities</h2>

            <div className="space-y-3">
              {data?.recent_inwards?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <p className="text-sm font-medium">
                      Inward #{item.inward_no}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              {data?.recent_jobs?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2 last:border-none"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-sm font-medium">
                      Job Card #{item.job_card_no}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TOP CUSTOMERS */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="font-semibold mb-5">Top Customers</h2>

            <div className="space-y-5">
              {data?.top_customers?.map((customer, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{customer.customer_name}</span>
                    <span className="font-semibold">
                      {customer.total_weight} Kg
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (customer.total_weight /
                            data.top_customers[0].total_weight) *
                            100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
