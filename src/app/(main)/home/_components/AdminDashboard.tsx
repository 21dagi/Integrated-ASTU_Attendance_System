"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, PieChart } from "lucide-react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Bar,
  Rectangle,
} from "recharts"; // Ensure correct imports

import { useGetAdminOverview } from "@/api/admin"; // Import the hook
import { DepartmentDistributionChart } from "@/components/graphs/DepartmentDistributionChart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function AdminDashboard() {
  const { data, isLoading, isError } = useGetAdminOverview(); // Fetch data using the hook

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching admin overview</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <CardDescription>All registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.overview.total_students} {/* Replace hardcoded value */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Teachers
            </CardTitle>
            <CardDescription>All faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.overview.total_instructors} {/* Replace hardcoded value */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Classes
            </CardTitle>
            <CardDescription>Current semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.overview.active_classes} {/* Replace hardcoded value */}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>
              Comparison of male and female students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                male: { label: "Male", color: "var(--chart-1)" },
                female: { label: "Female", color: "var(--chart-2)" },
              }}
            >
              <BarChart
                width={500}
                height={300}
                data={
                  data?.gender_distribution
                    ? data.gender_distribution.map((item) => ({
                        category: item.gender === "M" ? "Male" : "Female",
                        count: item.count,
                      }))
                    : []
                }
              >
                <defs>
                  <linearGradient
                    id="blueBlackGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#1E3A8A" /> {/* Dark Blue */}
                    <stop offset="100%" stopColor="#000000" /> {/* Black */}
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <span className="text-sm font-medium text-white">
                          {payload[0].value} {/* Display only the count */}
                        </span>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="url(#blueBlackGradient)" // Apply gradient
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <DepartmentDistributionChart data={data} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Academic Performance</CardTitle>
          <CardDescription>Average GPA by department</CardDescription>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <BarChart className="h-80 w-80 text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
