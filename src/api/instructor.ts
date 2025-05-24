import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CourseOfferingSessionsResponse,
  InstructorClassesResponse,
  InstructorDashboardResponse,
  SessionDetailsResponse,
} from "@/types/api";
import { BulkTakeAttendanceForm, createSessionFormSchema } from "@/types/forms";
import { z } from "zod";

export const useGetInstructorOverview = () => {
  return useQuery({
    queryKey: ["instructor-overview"],
    queryFn: async (): Promise<InstructorDashboardResponse> => {
      const response = await axios.get("/api/instructor/overview");
      return response.data;
    },
  });
};

export const useCreateSession = () => {
  return useMutation({
    mutationKey: ["create:session"],
    mutationFn: async (params: {
      id: number;
      data: z.infer<typeof createSessionFormSchema>;
    }) => {
      params.data.start_time = `2025-05-23T${params.data.start_time}:00`;
      params.data.end_time = `2025-05-23T${params.data.end_time}:00`;
      const response = await axios.post(
        `/api/offerings/${params.id}/sessions`,
        params.data
      );
      return response.data;
    },
  });
};

export const useGetClasses = () => {
  return useQuery({
    queryKey: ["instructor-classes"],
    queryFn: async (): Promise<InstructorClassesResponse[]> => {
      const response = await axios.get("/api/instructor/classes");
      return response.data;
    },
  });
};

export const useGetSessions = (offerind_id: number) => {
  return useQuery({
    queryKey: ["sessions", offerind_id],
    queryFn: async (): Promise<CourseOfferingSessionsResponse> => {
      const response = await axios.get(
        `/api/offerings/${offerind_id}/sessions`
      );
      return response.data;
    },
  });
};

export const useDelteSession = () => {
  return useMutation({
    mutationKey: ["delete:session"],
    mutationFn: async (id: number) => {
      const response = await axios.delete(`/api/sessions/${id}`);

      return response.data;
    },
  });
};

export const useGetSessionDetail = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ["session:detail", id],
    queryFn: async (): Promise<SessionDetailsResponse> => {
      const response = await axios.get(`/api/sessions/${id}/attendance`);
      return response.data;
    },
  });
};

export const useTakeBulkAttendance = () => {
  return useMutation({
    mutationKey: ["takebulk:attendance"],
    mutationFn: async ({
      sessionId,
      data,
    }: {
      sessionId: string;
      data: BulkTakeAttendanceForm;
    }) => {
      const response = await axios.post(
        `/api/sessions/${sessionId}/attendance`,
        data
      );

      return response.data;
    },
  });
};
