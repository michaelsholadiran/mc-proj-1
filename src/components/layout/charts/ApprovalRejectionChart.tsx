"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export const description = "A radial chart with text";

const chartData = [{ browser: "safari", visitors: 70, fill: "#27B8D9" }];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "#27B8D9",
  },
} satisfies ChartConfig;

export function ApprovalRejectionChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>APPROVAL VS REJECTION TREND</CardTitle>
        <CardDescription>
          The breakdown of approval and rejection rates to identify trends and
          patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="visitors"
              background
              cornerRadius={10}
              strokeWidth={8}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="font-bold"
                          fill="#27B8D9"
                          fontSize="18px"
                        >
                          {chartData[0].visitors.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {/* Visitors */}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>

        {/* Labels with color identifiers */}
        <div className="flex justify-center gap-8 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#27B8D9] rounded"></div>
            <span className="text-sm text-gray-700">Approval rate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#90E8FC] rounded"></div>
            <span className="text-sm text-gray-700">Rejection rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
