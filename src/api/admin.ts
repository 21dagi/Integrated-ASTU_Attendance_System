import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardResponse, CourseOffering, Student } from "@/types/admin_type";

interface ValidateIdParams {
  uni_id: string;
  sessionId: string;
  courseId: string;
}

export const useValidateScannedId = () => {
  return useMutation({
    mutationKey: ["validate:scanned-id"],
    mutationFn: async ({ uni_id, sessionId, courseId }: ValidateIdParams) => {
      const response = await axios.get(`/api/students/validate`, {
        params: { uni_id, sessionId, courseId },
      });
      return response.data;
    },
  });
};
export const useGetStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async (): Promise<Student[]> => {
      const response = await axios.get("/api/students"); // API endpoint
      return response.data;
    },
  });
};

export const useGetAdminOverview = () => {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: async (): Promise<DashboardResponse> => {
      const response = await axios.get("/api/admin/overview"); // API endpoint
      return response.data;
    },
  });
};

export const useGetCourseOfferings = () => {
  return useQuery({
    queryKey: ["course-offerings"],
    queryFn: async (): Promise<CourseOffering[]> => {
      const response = await axios.get("/api/admin/offerings");
      return response.data;
    },
  });
};
