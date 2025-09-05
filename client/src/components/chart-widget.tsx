import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  time: string;
  value: number;
}

interface ChartWidgetProps {
  data?: ChartData[];
  title?: string;
  height?: number;
}

// Generate sample chart data for demonstration
const generateSampleData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const baseValue = 127000;
    const variance = Math.random() * 10000 - 5000;
    data.push({
      time: date.toLocaleDateString(),
      value: baseValue + variance + (i * 20), // Slight upward trend
    });
  }
  
  return data;
};

export function ChartWidget({ data, title = "Portfolio Performance", height = 320 }: ChartWidgetProps) {
  const chartData = data || generateSampleData();

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
