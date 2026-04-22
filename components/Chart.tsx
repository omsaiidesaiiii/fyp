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
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { calculatePercentage, convertFileSize } from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "#FA7275", // Brand color directly
  },
} satisfies ChartConfig;

export const Chart = ({ used = 0 }: { used: number }) => {
  const chartData = [{ storage: used, fill: "#FA7275" }];

  return (
    <div className="flex items-center justify-between gap-6 w-full md:flex-row flex-col-reverse">
       <div className="flex-1 space-y-3 text-center md:text-left w-full">
          <div>
            <h3 className="text-xl font-bold text-dark-100">Available Storage</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">
               Using {convertFileSize(used)} of 2GB
            </p>
          </div>
          
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative">
             <div className="h-full bg-brand rounded-full absolute top-0 left-0 transition-all duration-1000" style={{ width: `${calculatePercentage(used)}%` }}></div>
          </div>
          <p className="text-xs text-gray-400 font-medium text-center md:text-left">
             Expand your storage for more space.
          </p>
       </div>

      <div className="relative w-[180px] h-[180px] flex-shrink-0 flex items-center justify-center">
         <ChartContainer config={chartConfig} className="w-full h-full aspect-square">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={Number(calculatePercentage(used)) * 3.6 + 90} 
            innerRadius={65}
            outerRadius={95}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-gray-50 last:fill-white"
              polarRadius={[75, 65]}
            />
            <RadialBar dataKey="storage" background cornerRadius={10} className="fill-brand stroke-none" />
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
                          className="fill-brand text-4xl font-bold"
                        >
                          {calculatePercentage(used)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 28}
                          className="fill-gray-400 text-xs uppercase tracking-wider font-semibold"
                        >
                          Used
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </div>
    </div>
  );
};