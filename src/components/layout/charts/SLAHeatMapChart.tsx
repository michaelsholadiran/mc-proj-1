"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Define the data structure for team members and timeframes
type TeamMemberData = {
  name: string;
  today: number;
  yesterday: number;
  last7d: number;
  last30d: number;
  last6m: number;
  last12m: number;
  last2yrs: number;
};

// Sample data with SLA status codes:
// 0 = No data (light grey)
// 1 = Within SLA (blue)
// 2 = Near SLA (yellow)
// 3 = Breached SLA (red)
const teamData: TeamMemberData[] = [
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 0,
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 2, // Near SLA (yellow)
    yesterday: 0,
    last7d: 0,
    last30d: 0,
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 1, // Within SLA (blue)
    last30d: 0,
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 3, // Breached SLA (red)
    last6m: 2, // Near SLA (yellow)
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 0,
    last6m: 1, // Within SLA (blue)
    last12m: 2, // Near SLA (yellow)
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 3, // Breached SLA (red)
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 0,
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
  {
    name: "Jane Doe",
    today: 0,
    yesterday: 0,
    last7d: 0,
    last30d: 0,
    last6m: 0,
    last12m: 0,
    last2yrs: 0,
  },
];

const timeframes = [
  "Today",
  "Yesterday",
  "Last 7d",
  "Last 30d",
  "Last 6m",
  "Last 12m",
  "Last 2yrs",
];

export function SLAHeatMapChart() {
  // Transform data to ApexCharts series format
  const apexSeries = teamData.map((member) => {
    const dataPoints = timeframes.map((timeframe) => {
      const key = timeframe
        .toLowerCase()
        .replace(/\s+/g, "") as keyof TeamMemberData;
      return {
        x: timeframe,
        y: member[key],
      };
    });
    return {
      name: member.name,
      data: dataPoints,
    };
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: "heatmap",
      height: 400,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false, // Hide values inside cells
    },
    colors: ["#E5E7EB"], // Default light grey color
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 4, // Rounded corners
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              name: "No Data",
              color: "#E5E7EB", // Light grey
            },
            {
              from: 1,
              to: 1,
              name: "Within SLA",
              color: "#3B82F6", // Blue
            },
            {
              from: 2,
              to: 2,
              name: "Near SLA",
              color: "#F59E0B", // Yellow
            },
            {
              from: 3,
              to: 3,
              name: "Breached SLA",
              color: "#EF4444", // Red
            },
          ],
        },
      },
    },
    xaxis: {
      type: "category",
      categories: timeframes,
      labels: {
        style: {
          fontSize: "12px",
          colors: "#374151", // Dark grey
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: "#9CA3AF", // Light grey for team member names
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const status = series[seriesIndex][dataPointIndex];
        let statusText = "No Data";

        if (status === 1) {
          statusText = "Within SLA";
        } else if (status === 2) {
          statusText = "Near SLA";
        } else if (status === 3) {
          statusText = "Breached SLA";
        }

        return `
          <div class="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p class="font-medium text-gray-900">${w.globals.labels[dataPointIndex]}</p>
            <p class="text-sm text-gray-600">${statusText}</p>
          </div>
        `;
      },
    },
    legend: {
      show: false, // Hide default legend
    },
  };

  return (
    <div className="bg-[#F8F8F8] p-6 rounded-lg shadow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">SLA HEAT MAP</h2>
        <p className="text-sm text-gray-600">
          Visualizing SLA performance metrics and compliance rates for teams
        </p>
      </div>

      <div className="mb-6">
        <Chart
          options={chartOptions}
          series={apexSeries}
          type="heatmap"
          height={400}
        />
      </div>

      {/* Custom Legend */}
      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#F59E0B" }}
          ></div>
          <span className="text-sm font-medium text-gray-800">Near SLA</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#EF4444" }}
          ></div>
          <span className="text-sm font-medium text-gray-800">
            Breached SLA
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: "#3B82F6" }}
          ></div>
          <span className="text-sm font-medium text-gray-800">Within SLA</span>
        </div>
      </div>
    </div>
  );
}
