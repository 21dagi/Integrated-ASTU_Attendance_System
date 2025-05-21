import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { StudentDashboardResponse } from "@/types/api";

export const useGetStudentOverview = () => {
  return useQuery({
    queryKey: ["student-overview"],
    queryFn: async (): Promise<StudentDashboardResponse> => {
      const response = await axios.get("/api/student/overview");
      return response.data;
    },
  });
};
