"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSessionFormSchema,
  CreateSessionFormData,
  CreateSessionRequest,
} from "@/types/forms";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateSession } from "@/api/instructor";
import { useRouter } from "next/navigation";
import { InstructorClassesResponse } from "@/types/api";
import { toast } from "sonner";
import { useState } from "react";
import { AxiosError } from "axios";

interface ClassDisplayProps {
  class_: InstructorClassesResponse;
}

const ClassDisplay = ({ class_: classInfo }: ClassDisplayProps) => {
  return (
    <div className="flex flex-col">
      <span className="font-medium">
        {classInfo.course.code} - {classInfo.course.title}
      </span>
      <span className="text-sm text-muted-foreground">
        {classInfo.semester.academic_year} {classInfo.semester.name} - Year{" "}
        {classInfo.section.year_level} Section - {classInfo.section.label}
      </span>
    </div>
  );
};

interface CreateSessionFormProps {
  classes: InstructorClassesResponse[];
}

export const CreateSessionForm = ({ classes }: CreateSessionFormProps) => {
  const router = useRouter();
  const createSession = useCreateSession();
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0].id);

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  const form = useForm<CreateSessionFormData>({
    resolver: zodResolver(createSessionFormSchema),
    defaultValues: {
      session_date: "",
      start_time: "",
      end_time: "",
    },
  });

  const onSubmit = async (data: CreateSessionFormData) => {
    try {
      if (!selectedClassId) {
        toast.error("Please select a class");
        return;
      }

      const request: CreateSessionFormData = {
        session_date: data.session_date,
        start_time: data.start_time,
        end_time: data.end_time,
      };

      await createSession.mutateAsync({ data: request, id: selectedClassId });
      toast.success("Session created successfully");
      router.refresh();
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.semester_start) {
        let errorMessage =
          error.response?.data.semester_start +
          " - " +
          error.response?.data.semester_end;

        toast.error("Session date is out of range", {
          description: errorMessage,
        });
      } else {
        toast.error("Failed to create session");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Select Class</FormLabel>
          <Select
            onValueChange={(value) => setSelectedClassId(Number(value))}
            value={selectedClassId.toString()}
          >
            <FormControl>
              <SelectTrigger className="py-6">
                <SelectValue>
                  {selectedClass && <ClassDisplay class_={selectedClass} />}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {classes.map((class_) => (
                <SelectItem key={class_.id} value={class_.id.toString()}>
                  <ClassDisplay class_={class_} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
          name="session_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Session Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ""}
                  min={
                    selectedClass
                      ? new Date(selectedClass.semester.start_date)
                          .toISOString()
                          .split("T")[0]
                      : undefined
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createSession.isPending}
        >
          {createSession.isPending ? "Creating..." : "Create Session"}
        </Button>
      </form>
    </Form>
  );
};
