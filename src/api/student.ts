import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  StudentAttendanceResponse,
  StudentClassesResponse,
  StudentDashboardResponse,
} from "@/types/api";

export const useGetStudentOverview = () => {
  return useQuery({
    queryKey: ["student-overview"],
    queryFn: async (): Promise<StudentDashboardResponse> => {
      const response = await axios.get("/api/student/overview");
      return response.data;
    },
  });
};

export const useGetStudentClasses = () => {
  return useQuery({
    queryKey: ["student-classes"],
    queryFn: async (): Promise<StudentClassesResponse> => {
      const response = await axios.get("/api/student/enrollments");
      return response.data;
    },
  });
};

export const useGetStudentAttendance = (offering_id: string) => {
  return useQuery({
    queryKey: ["student-attendance", offering_id],
    queryFn: async (): Promise<StudentAttendanceResponse> => {
      const response = await axios.get(
        `/api/student/attendance/${offering_id}`
      );
      return response.data;
    },
  });
};
