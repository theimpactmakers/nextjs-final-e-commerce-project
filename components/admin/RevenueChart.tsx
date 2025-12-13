"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type RevenueData = {
  date: string;
  revenue: number;
  orders: number;
};

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Umsatz & Bestellungen (Letzte 7 Tage)
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            yAxisId="left"
            stroke="hsl(217 91% 60%)"
            fontSize={12}
            label={{ value: "Umsatz (€)", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="hsl(33 100% 37%)"
            fontSize={12}
            label={{
              value: "Bestellungen",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number, name: string) => {
              if (name === "revenue") {
                return [`€${value.toFixed(2)}`, "Umsatz"];
              }
              return [value, "Bestellungen"];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="hsl(217 91% 60%)"
            strokeWidth={3}
            dot={{ fill: "hsl(217 91% 60%)", r: 5 }}
            activeDot={{ r: 7 }}
            name="Umsatz"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="hsl(33 100% 37%)"
            strokeWidth={3}
            dot={{ fill: "hsl(33 100% 37%)", r: 5 }}
            activeDot={{ r: 7 }}
            name="Bestellungen"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
