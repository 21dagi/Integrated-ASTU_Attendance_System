import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  InstructorClassesResponse,
  InstructorDashboardResponse,
} from "@/types/api";
import { createSessionFormSchema } from "@/types/forms";
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
