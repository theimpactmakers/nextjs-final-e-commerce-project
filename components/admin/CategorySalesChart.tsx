"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type CategoryData = {
  category: string;
  revenue: number;
  orders: number;
};

interface CategorySalesChartProps {
  data: CategoryData[];
}

export function CategorySalesChart({ data }: CategorySalesChartProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Verkäufe nach Kategorie
      </h2>
      {data.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          Keine Daten verfügbar
        </p>
      )}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="category"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis
            yAxisId="left"
            stroke="#000000"
            fontSize={12}
            label={{
              value: "Bestellungen",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#C87C28"
            fontSize={12}
            label={{
              value: "Umsatz (€)",
              angle: 90,
              position: "insideRight",
              style: { textAnchor: "middle" },
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
          <Legend
            formatter={(value) => {
              if (value === "revenue") return "Umsatz (€)";
              if (value === "orders") return "Anzahl Bestellungen";
              return value;
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="orders"
            fill="#000000"
            name="orders"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="revenue"
            fill="#C87C28"
            name="revenue"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
