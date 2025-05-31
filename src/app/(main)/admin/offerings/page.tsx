import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";

export default function OfferingsPage() {
  return (
    <div className="space-y-10">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Course Offerings</CardTitle>
          <CardDescription>Current and past course offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search offerings..." className="pl-8" />
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Offering
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Year Level</TableHead>
                <TableHead>Number of Students</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                 {
    section: "1",
    department: "Computer Science",
    instructor: "Dr. Alice Smith",
    year: 2,
    students: 45,
    academicYear: "2024/25",
    semester: "1st",
  },
  {
    section: "2",
    department: "Mathematics",
    instructor: "Dr. John Doe",
    year: 1,
    students: 38,
    academicYear: "2024/25",
    semester: "2nd",
  },
  {
    section: "1",
    department: "Physics",
    instructor: "Dr. Rachel Green",
    year: 1,
    students: 40,
    academicYear: "2024/25",
    semester: "1st",
  },
  {
    section: "3",
    department: "Software Engineering",
    instructor: "Dr. Elias Teklu",
    year: 3,
    students: 50,
    academicYear: "2024/25",
    semester: "2nd",
  },
  {
    section: "2",
    department: "Electrical Engineering",
    instructor: "Dr. Hana Gebre",
    year: 2,
    students: 42,
    academicYear: "2024/25",
    semester: "1st",
  },
  {section: "1",
    department: "Computer Science",
    instructor: "Dr. Alice Smith",
    year: 2,
    students: 45,
    academicYear: "2024/25",
    semester: "1st",
  },
  {
    section: "2",
    department: "Mathematics",
    instructor: "Dr. John Doe",
    year: 1,
    students: 38,
    academicYear: "2024/25",
    semester: "2nd",
  },
  {
    section: "1",
    department: "Physics",
    instructor: "Dr. Rachel Green",
    year: 1,
    students: 40,
    academicYear: "2024/25",
    semester: "1st",
  },
  {
    section: "3",
    department: "Software Engineering",
    instructor: "Dr. Elias Teklu",
    year: 3,
    students: 50,
    academicYear: "2024/25",
    semester: "2nd",
  },
  {
    section: "2",
    department: "Electrical Engineering",
    instructor: "Dr. Hana Gebre",
    year: 2,
    students: 42,
    academicYear: "2024/25",
    semester: "1st",
  },
              ].map((offering, i) => (
                <TableRow key={i}>
                  <TableCell>{offering.section}</TableCell>
                  <TableCell>{offering.department}</TableCell>
                  <TableCell>{offering.instructor}</TableCell>
                  <TableCell>{offering.year}</TableCell>
                  <TableCell>{offering.students}</TableCell>
                  <TableCell>{offering.academicYear}</TableCell>
                  <TableCell>{offering.semester}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}