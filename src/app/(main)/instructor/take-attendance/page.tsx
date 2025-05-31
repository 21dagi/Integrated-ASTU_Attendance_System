"use client";
import {
  useGetClasses,
  useGetSessions,
  useDelteSession,
} from "@/api/instructor";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseSessions } from "./_components/CourseSessions";
import { CreateSessionModal } from "./_components/CreateSessionModal";
import { useState } from "react";
import { ClassDisplay } from "./_components/ClassDisplay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function TakeAttendancePage() {
  const queryClient = useQueryClient();
  const { data: classes, isLoading: isLoadingClasses } = useGetClasses();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const { data: sessions, isLoading: isLoadingSessions } = useGetSessions(
    selectedClassId || 0
  );
  const deleteSession = useDelteSession();

  const handleDeleteSession = async (sessionId: number) => {
    try {
      await deleteSession.mutateAsync(sessionId);
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("faild to delete session", {
          description: error.response?.data.message,
        });
      }
      toast.error("faild to delete session");
    }
  };

  if (isLoadingClasses) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!classes || classes.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No classes assigned for the current semester.
        </p>
      </Card>
    );
  }

  // Set initial selected class if not set
  if (!selectedClassId && classes.length > 0) {
    setSelectedClassId(classes[0].id);
  }

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Take Attendance
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a class to view and manage attendance sessions
          </p>
        </div>
        {selectedClassId && (
          <CreateSessionModal
            classes={classes}
            selectedClassId={selectedClassId}
            onSessionCreated={() => {
              // Refetch sessions after creating a new one
              // This will be handled by React Query's automatic refetching
            }}
          />
        )}
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <Select
            value={selectedClassId?.toString()}
            onValueChange={(value) => setSelectedClassId(Number(value))}
          >
            <SelectTrigger className=" py-7">
              <SelectValue>
                {selectedClassId && (
                  <ClassDisplay
                    class_={classes.find((c) => c.id === selectedClassId)!}
                  />
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {classes.map((class_) => (
                <SelectItem key={class_.id} value={class_.id.toString()}>
                  <ClassDisplay class_={class_} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">
              {selectedClass.total_students} students
            </Badge>
            <span>•</span>
            <Badge variant="secondary">
              {selectedClass.course.credits} credits
            </Badge>
            <span>•</span>
            <Badge variant="secondary">{selectedClass.semester.name}</Badge>
            <span>•</span>
            <Badge variant="secondary">
              {selectedClass.semester.academic_year}
            </Badge>
          </div>
        )}

        {isLoadingSessions ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : sessions ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Attendance Sessions</h3>
              {sessions.sessions.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {sessions.sessions.length} total sessions
                </div>
              )}
            </div>
            <CourseSessions
              sessions={sessions.sessions}
              onDeleteSession={handleDeleteSession}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No sessions found for this class.
          </p>
        )}
      </Card>
    </div>
  );
}
