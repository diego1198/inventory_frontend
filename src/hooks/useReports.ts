import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";

type DailyReportData = {
  date: string;
  totalSales: number;
  totalRevenue: number;
  totalTax: number;
  topProducts: any[];
  sales: any[];
};

type MonthlyReportData = {
  month: number;
  year: number;
  totalSales: number;
  totalRevenue: number;
  totalTax: number;
};

export function useDailyReport(date?: string) {
  return useQuery({
    queryKey: ["reports", "daily", { date }],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DailyReportData>>("/reports/daily", { params: { date } });
      return data;
    },
  });
}

export function useMonthlyReport(year?: number, month?: number) {
  return useQuery({
    queryKey: ["reports", "monthly", { year, month }],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<MonthlyReportData>>("/reports/monthly", { params: { year, month } });
      return data;
    },
  });
}


