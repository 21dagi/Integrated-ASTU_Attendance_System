"use client";

import { Pie, PieChart } from "recharts";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DepartmentDistributionChart({ data }: { data: any }) {
  const chartData = data?.department_distribution.map(
    (department: any, index: number) => ({
      name: department.name,
      count: department.count,
      fill: ["#1E3A8A", "#1E40AF", "#1E429F", "#1E3A6D"][index % 4], // Dimmer blue/black colors
    })
  );

  const chartConfig = chartData.reduce(
    (config: any, department: any, index: number) => {
      config[department.name] = {
        label: department.name,
        color: `var(--chart-${index + 1})`,
      };
      return config;
    },
    {}
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Department Distribution</CardTitle>
        <CardDescription>Students by department</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
