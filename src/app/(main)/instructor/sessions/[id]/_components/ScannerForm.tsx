"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode } from "lucide-react";
import { AttendanceStatus } from "@prisma/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useTakeBulkAttendance } from "@/api/instructor";

import { useValidateScannedId } from "@/api/admin";

interface ScannerProps {
  sessionId: string;
  courseId: string;
  onValidScan: (studentId: number, status: AttendanceStatus) => void;
}

interface ScannedRecord {
  uni_id: string;
  timestamp: Date;
  isValid: boolean;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    uni_id: string;
  };
}

const scannerFormSchema = z.object({
  scanned_attendance: z.array(
    z.object({
      student_id: z.number(),
      status: z.enum(["PRESENT", "ABSENT", "LATE"]),
    })
  ),
});

type ScannerFormData = z.infer<typeof scannerFormSchema>;

export function ScannerForm({
  sessionId,
  courseId,
  onValidScan,
}: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedRecords, setScannedRecords] = useState<ScannedRecord[]>([]);
  const validateScannedId = useValidateScannedId();

  const queryClient = useQueryClient();
  const takeAttendance = useTakeBulkAttendance();

  const form = useForm<ScannerFormData>({
    resolver: zodResolver(scannerFormSchema),
    defaultValues: {
      scanned_attendance: [],
    },
  });

  const onSubmit = (data: ScannerFormData) => {
    takeAttendance.mutate(
      {
        sessionId: sessionId,
        data: data.scanned_attendance,
      },
      {
        onSuccess: () => {
          toast.success("Scanned attendance submitted successfully");
          queryClient.invalidateQueries({
            queryKey: ["session:detail", sessionId],
          });
          // Reset scanned records after successful submission
          setScannedRecords([]);
        },
        onError: () => {
          toast.error("Failed to submit scanned attendance");
        },
      }
    );
  };

  const handleScannedId = useCallback(
    async (uni_id: string) => {
      validateScannedId.mutate(
        { uni_id, sessionId, courseId },
        {
          onSuccess: (data: {
            isValid: any;
            student: {
              id: number;
              first_name: any;
              last_name: any;
              uni_id: any;
            };
          }) => {
            const newRecord: ScannedRecord = {
              uni_id,
              timestamp: new Date(),
              isValid: data.isValid,
              student: data.student,
            };

            setScannedRecords((prev) => [...prev, newRecord]);

            if (data.isValid && data.student) {
              // Update form data with the new scanned record
              const currentAttendance = form.getValues("scanned_attendance");
              form.setValue("scanned_attendance", [
                ...currentAttendance,
                {
                  student_id: data.student.id,
                  status: "PRESENT" as AttendanceStatus,
                },
              ]);

              onValidScan(data.student.id, "PRESENT");
              toast.success(`Marked ${data.student.first_name} as present`);
            } else {
              toast.error(`Invalid ID: ${uni_id}`);
            }
          },
          onError: () => {
            toast.error(`Failed to validate ID: ${uni_id}`);
          },
        }
      );
    },
    [validateScannedId, sessionId, courseId, onValidScan]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 mb-6 rounded-lg border ">
          {/* Scanner Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-sm">Scanner Status</span>
              <span className="text-xs text-muted-foreground">
                ({scannedRecords.length} scanned)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isScanning ? "destructive" : "default"}
                onClick={() => setIsScanning(!isScanning)}
              >
                {isScanning ? "Stop Scanning" : "Start Scanning"}
              </Button>
              <Button
                type="submit"
                disabled={
                  scannedRecords.length === 0 || takeAttendance.isPending
                }
              >
                {takeAttendance.isPending ? "Submitting..." : "Submit Scanned"}
              </Button>
            </div>
          </div>

          {/* Scanned Records Display */}

          <ScrollArea className="h-[500px] rounded-md border p-4">
            <div className="space-y-4">
              {scannedRecords.map((record, index) => (
                <div
                  key={`${record.uni_id}-${index}`}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    record.isValid ? "border-green-200" : "border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      {record.isValid && record.student ? (
                        <>
                          <p className="font-medium">
                            {record.student.first_name}{" "}
                            {record.student.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.student.uni_id}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-red-500">
                          Invalid ID: {record.uni_id}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {record.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  {record.isValid && record.student && (
                    <Badge variant="default">Marked Present</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </form>
    </Form>
  );
}
