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

interface CreateSessionFormProps {
  classes: InstructorClassesResponse[];
}

export const CreateSessionForm = ({ classes }: CreateSessionFormProps) => {
  const router = useRouter();
  const createSession = useCreateSession();
  const [selectedClassId, setSelectedClassId] = useState<number>(classes[0].id);

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
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {classes.map((class_) => (
                <SelectItem key={class_.id} value={class_.id.toString()}>
                  {class_.course.code} - {class_.course.title}
                  {class_.semester.academic_year} {class_.semester.name} YEAR -{" "}
                  {class_.section.year_level} {class_.section.label}
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
                    new Date(
                      classes.find(
                        (c) => c.id === selectedClassId
                      )!.semester.start_date
                    )
                      .toISOString()
                      .split("T")[0]
                  } // Prevent selecting past dates
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
