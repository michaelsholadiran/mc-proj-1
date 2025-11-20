"use client";

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";

const chartData = [
  {
    label: "a",
    // value: "00:12:00",
    role: "KYC Initiator",
    color: "#F59E0B", // Orange
    timeInSeconds: 720, // 12 minutes in seconds
  },
  {
    label: "b",
    // value: "00:35:00",
    role: "Field Officer",
    color: "#06B6D4", // Teal/Light Blue
    timeInSeconds: 2100, // 35 minutes in seconds
  },
  {
    label: "c",
    // value: "00:06:30",
    role: "KYC Supervisor",
    color: "#6BAC91", // Muted Green
    timeInSeconds: 390, // 6 minutes 30 seconds in seconds
  },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      role: string;
      value: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{payload[0].payload.role}</p>
        <p className="text-sm text-gray-600">{payload[0].payload.value}</p>
      </div>
    );
  }
  return null;
};

export function TurnaroundTimeChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          TURNAROUND TIME (TAT)
        </h2>
        <p className="text-sm text-gray-600">
          Average time taken by each role to complete tasks, highlighting
          efficiency and productivity
        </p>
      </div>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: "#374151" }}
            />
            <YAxis hide={true} domain={[0, "dataMax + 200"]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="timeInSeconds" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Value labels above bars */}
      <div className="flex justify-between mb-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 text-center">
            <div className="text-lg font-semibold text-gray-800 mb-1">
              {item.timeInSeconds >= 3600
                ? `${Math.floor(item.timeInSeconds / 3600)}:${String(
                    Math.floor((item.timeInSeconds % 3600) / 60)
                  ).padStart(2, "0")}:${String(
                    item.timeInSeconds % 60
                  ).padStart(2, "0")}`
                : `${String(Math.floor(item.timeInSeconds / 60)).padStart(
                    2,
                    "0"
                  )}:${String(item.timeInSeconds % 60).padStart(2, "0")}`}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-col justify-center items-center gap-4 space-x-6">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: item.color }}
            >
              {item.label}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {item.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
