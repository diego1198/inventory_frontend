"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

type DailyReport = {
  data: {
    date: string;
    totalSales: number;
    totalRevenue: number;
    totalTax: number;
    topProducts: any[];
    sales: any[];
  };
  timestamp: string;
  success: boolean;
};

export default function DashboardPage() {
  const { data: daily } = useQuery({
    queryKey: ["reports", "daily"],
    queryFn: async () => {
      const { data } = await api.get<DailyReport>("/reports/daily");
      return data;
    },
  });

  // For now, we'll show a single day's data since the API returns one day
  // In the future, you might want to fetch multiple days for the chart
  const chartData = daily?.data ? [
    {
      name: daily.data.date,
      ventas: daily.data.totalSales,
      ingresos: daily.data.totalRevenue,
      impuestos: daily.data.totalTax
    }
  ] : [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{daily?.data?.totalSales || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ingresos del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${daily?.data?.totalRevenue || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Impuestos del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${daily?.data?.totalTax || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas del Día</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ingresos del Día</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingresos" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


