"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SessionDetailsResponse } from "@/types/api";
import { AttendanceStatus } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTakeBulkAttendance } from "@/api/instructor";
import {
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardEdit,
  ScanLine,
} from "lucide-react";
import { ScannerForm } from "./ScannerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const attendanceFormSchema = z.object({
  attendance: z.array(
    z.object({
      student_id: z.number(),
      status: z.enum(["PRESENT", "ABSENT", "LATE"]),
    })
  ),
});

type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

interface AttendanceFormProps {
  session: SessionDetailsResponse;
}

export function AttendanceForm({ session }: AttendanceFormProps) {
  const queryClient = useQueryClient();
  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >(
    session.attendance_records.reduce(
      (acc, record) => ({
        ...acc,
        [record.student.id]: record.status,
      }),
      {}
    )
  );

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      attendance: session.attendance_records.map((record) => ({
        student_id: record.student.id,
        status: record.status,
      })),
    },
  });

  const takeAttendance = useTakeBulkAttendance();

  const onSubmit = (data: AttendanceFormData) => {
    takeAttendance.mutate(
      {
        sessionId: session.session_id.toString(),
        data: data.attendance,
      },
      {
        onSuccess: () => {
          toast.success("Attendance updated successfully");
          queryClient.invalidateQueries({
            queryKey: ["session:detail", session.session_id.toString()],
          });
        },
        onError: () => {
          toast.error("Failed to update attendance");
        },
      }
    );
  };

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    const currentAttendance = form.getValues("attendance");
    const updatedAttendance = currentAttendance.map((record) =>
      record.student_id === studentId ? { ...record, status } : record
    );

    form.setValue("attendance", updatedAttendance);
  };

  // Handle batch action to mark all students with the same status
  const handleBatchAction = (status: AttendanceStatus) => {
    const updatedAttendance: Record<number, AttendanceStatus> = {};
    const formAttendance = session.attendance_records.map((record) => {
      updatedAttendance[record.student.id] = status;
      return {
        student_id: record.student.id,
        status: status,
      };
    });

    setAttendance(updatedAttendance);
    form.setValue("attendance", formAttendance);
    toast.success(`Marked all students as ${status.toLowerCase()}`);
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "ABSENT":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      case "LATE":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Session Information</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">
            {session.course_info.code} - {session.course_info.title}
          </Badge>
          <Badge variant="secondary">Section {session.section}</Badge>
          <Badge variant="secondary">{session.semester}</Badge>
        </div>
      </div>
      {/* Tabs */}

      <Tabs defaultValue="manual" className="mt-6">
        <TabsList className="w-full grid grid-cols-2 h-11 items-stretch rounded-lg bg-muted p-1 text-muted-foreground">
          <TabsTrigger
            value="manual"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center justify-center gap-2 transition-all"
          >
            <ClipboardEdit className="h-4 w-4" />
            <span>Manual Entry</span>
          </TabsTrigger>
          <TabsTrigger
            value="scanner"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md flex items-center justify-center gap-2 transition-all"
          >
            <ScanLine className="h-4 w-4" />
            <span>Scanner Entry</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="manual"
          className="mt-4 rounded-lg border bg-card p-6 shadow-sm"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Batch Actions */}
              <div className="mb-6 rounded-lg border bg-muted/50 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-sm">Batch Actions</span>
                    <span className="text-xs text-muted-foreground">
                      ({session.attendance_records.length} students)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchAction("PRESENT")}
                      className="text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-950"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Mark All Present
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchAction("ABSENT")}
                      className="text-red-700 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Mark All Absent
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleBatchAction("LATE")}
                      className="text-yellow-700 border-yellow-200 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-950"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Mark All Late
                    </Button>
                  </div>
                </div>
              </div>

              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-4">
                  {session.attendance_records.map((record) => (
                    <div
                      key={record.student.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div>
                          <p className="font-medium">
                            {record.student.first_name}{" "}
                            {record.student.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.student.uni_id}
                          </p>
                        </div>
                      </div>
                      <Select
                        value={attendance[record.student.id]}
                        onValueChange={(value: AttendanceStatus) =>
                          handleStatusChange(record.student.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            <Badge
                              className={getStatusColor(
                                attendance[record.student.id]
                              )}
                            >
                              {attendance[record.student.id]}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PRESENT">
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              PRESENT
                            </Badge>
                          </SelectItem>
                          <SelectItem value="ABSENT">
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                              ABSENT
                            </Badge>
                          </SelectItem>
                          <SelectItem value="LATE">
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                              LATE
                            </Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={takeAttendance.isPending}
                  className="w-full sm:w-auto"
                >
                  {takeAttendance.isPending
                    ? "Updating..."
                    : "Update Attendance"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent
          className="mt-4 rounded-lg border bg-card p-6 shadow-sm"
          value="scanner"
        >
          <ScannerForm
            sessionId={session.session_id.toString()}
            courseId={session.course_info.code.toString()}
            onValidScan={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
