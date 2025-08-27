"use client";

import { useMonthlyReport } from "@/hooks/useReports";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
  const { data: monthly } = useMonthlyReport();
  
  // Transform the data to match the chart requirements
  const chartData = monthly?.data ? [
    {
      name: `${monthly.data.month}/${monthly.data.year}`,
      ventas: monthly.data.totalSales,
      ingresos: monthly.data.totalRevenue,
      impuestos: monthly.data.totalTax
    }
  ] : [];

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Reportes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Reporte Mensual</CardTitle>
        </CardHeader>
        <CardContent className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ingresos" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Summary of monthly data */}
      {monthly?.data && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Ventas del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{monthly.data.totalSales}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Ingresos del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${monthly.data.totalRevenue}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Total Impuestos del Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${monthly.data.totalTax}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


