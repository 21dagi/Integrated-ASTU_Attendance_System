import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Plus, Search } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="space-y-10">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Courses</CardTitle>
          <CardDescription>Manage all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search courses..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Credit Hour</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
               { name: "Calculus I", cr_hr: 3, code: "MATH101" },
  { name: "Introduction to Programming", cr_hr: 4, code: "CS101" },
  { name: "Physics I", cr_hr: 3, code: "PHYS101" },
  { name: "English Composition", cr_hr: 2, code: "ENG101" },
  { name: "Data Structures", cr_hr: 4, code: "CS201" },
  { name: "General Chemistry", cr_hr: 3, code: "CHEM101" },
  { name: "Digital Logic Design", cr_hr: 3, code: "ECE202" },
  { name: "Object-Oriented Programming", cr_hr: 4, code: "CS301" },
  { name: "Economics", cr_hr: 2, code: "ECON101" },
              ].map((course, i) => (
                <TableRow key={i}>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.cr_hr}</TableCell>
                  <TableCell>{course.code}</TableCell>
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