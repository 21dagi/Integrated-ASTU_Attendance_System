import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { InstructorDashboardResponse } from "@/types/api";

export const useGetInstructorOverview = () => {
  return useQuery({
    queryKey: ["instructor-overview"],
    queryFn: async (): Promise<InstructorDashboardResponse> => {
      const response = await axios.get("/api/instructor/overview");
      return response.data;
    },
  });
};
