import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart } from "lucide-react"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <CardDescription>All registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,853</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <CardDescription>All faculty members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <CardDescription>Current semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87</div>
            <p className="text-xs text-muted-foreground">+5% from last semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Student Enrollment</CardTitle>
            <CardDescription>Monthly enrollment trends</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <LineChart className="h-64 w-64 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Students by department</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <PieChart className="h-64 w-64 text-muted-foreground" />
          </CardContent>
        </Card>
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
  )
}
