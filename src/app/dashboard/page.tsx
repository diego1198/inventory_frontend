"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Receipt } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";


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

  const chartData = daily?.data ? [
    {
      name: daily.data.date,
      ventas: daily.data.totalSales,
      ingresos: daily.data.totalRevenue,
      impuestos: daily.data.totalTax
    }
  ] : [];

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
            style={{
              background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Dashboard
          </h1>
          <p className="text-slate-600">
            Resumen de actividades del día
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-4 sm:mb-6 lg:mb-8">
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(90deg, #3b82f6, #2563eb)`
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Ventas del Día
              </CardTitle>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, #3b82f6, #2563eb)`,
                  boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)"
                }}
              >
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{daily?.data?.totalSales || 0}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Transacciones completadas
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(90deg, #10b981, #059669)`
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Ingresos del Día
              </CardTitle>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, #10b981, #059669)`,
                  boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.39)"
                }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${(daily?.data?.totalRevenue || 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Total generado
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <div
              className="h-2 w-full"
              style={{
                background: `linear-gradient(90deg, var(--primary-gradient-start), var(--primary-gradient-end))`
              }}
            />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                Impuestos del Día
              </CardTitle>
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, var(--primary-gradient-start), var(--primary-gradient-end))`,
                  boxShadow: "0 4px 14px 0 rgba(139, 92, 246, 0.39)"
                }}
              >
                <Receipt className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                ${(daily?.data?.totalTax || 0).toFixed(2)}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Impuestos recaudados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Ventas del Día
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="ventas" fill="url(#blueGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card
            className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Ingresos del Día
              </CardTitle>
            </CardHeader>
            <CardContent className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis dataKey="name" className="text-sm" />
                  <YAxis className="text-sm" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar dataKey="ingresos" fill="url(#greenGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
