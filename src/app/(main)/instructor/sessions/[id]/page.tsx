"use client";
import { useGetSessionDetail } from "@/api/instructor";
import { AttendanceForm } from "./_components/AttendanceForm";
import { AttendanceFormSkeleton } from "./_components/AttendanceFormSkeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SessionAttendancePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: session, isLoading } = useGetSessionDetail(params?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Take Attendance
          </h2>
          <p className="text-sm text-muted-foreground">
            Record attendance for this session
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {isLoading ? (
        <AttendanceFormSkeleton />
      ) : session ? (
        <AttendanceForm session={session} />
      ) : (
        <div className="rounded-lg border p-6 text-center">
          <p className="text-muted-foreground">Session not found</p>
        </div>
      )}
    </div>
  );
}
