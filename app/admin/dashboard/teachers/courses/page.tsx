import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils" // assuming you use className merge helper (optional)

export function CoursesPage() {
  const courses = [
    {
      id: "CS101",
      title: "Introduction to Computer Science",
      semester: "Spring 2025",
      students: 32,
      schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
      location: "Tech Building 305",
      nextSession: "Monday, May 5, 2025",
      color: "border-t-4 border-blue-500",
    },
    {
      id: "CS201",
      title: "Data Structures and Algorithms",
      semester: "Spring 2025",
      students: 28,
      schedule: "Tue, Thu 1:00 PM - 3:00 PM",
      location: "Tech Building 210",
      nextSession: "Tuesday, May 6, 2025",
      color: "border-t-4 border-green-500",
    },
    {
      id: "CS305",
      title: "Database Systems",
      semester: "Spring 2025",
      students: 24,
      schedule: "Mon, Wed 3:30 PM - 5:00 PM",
      location: "Tech Building 110",
      nextSession: "Monday, May 5, 2025",
      color: "border-t-4 border-purple-500",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Classes</h1>
      <p className="text-muted-foreground">View all courses you are teaching this semester</p>

  
      <div className="flex space-x-4 border-b pb-2">
        <button className="border-b-2 border-black font-semibold">Current Semester</button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className={cn("shadow-md border rounded-lg", course.color)}>
            <CardHeader>
              <CardTitle className="text-lg font-bold">{course.id}</CardTitle>
              <CardDescription>{course.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{course.semester}</p>
              <p className="text-sm">{course.students} Students</p>
              <p className="text-sm">{course.schedule}</p>
              <p className="text-sm">{course.location}</p>
              <p className="text-sm text-muted-foreground">
                <strong>Next Session:</strong> {course.nextSession}
              </p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-black text-white hover:bg-black/90">
  Take Attendance
</Button>

                <button className="bg-white hover:bg-gray">Details</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
