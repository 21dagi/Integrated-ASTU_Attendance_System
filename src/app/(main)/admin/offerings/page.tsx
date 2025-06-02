"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { useGetCourseOfferings } from "@/api/admin";
export default function OfferingsPage() {
  const { data, isLoading, isError } = useGetCourseOfferings();

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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-red-500">
                    Error fetching course offerings
                  </TableCell>
                </TableRow>
              )}
              {data?.map((offering) => (
                <TableRow key={offering.id}>
                  <TableCell>{offering.section.id}</TableCell>
                  <TableCell>
                    {offering.section.department?.name || "unspecified"}
                  </TableCell>
                  <TableCell>
                    {offering.instructor.first_name}{" "}
                    {offering.instructor.last_name}
                  </TableCell>
                  <TableCell>{offering.section.year_level}</TableCell>
                  <TableCell>{offering.totalStudents}</TableCell>
                  <TableCell>{offering.semester.academic_year_id}</TableCell>
                  <TableCell>{offering.semester.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
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
