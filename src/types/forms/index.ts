import { z } from "zod";

// Schema for form input (handles string values)
export const createSessionFormSchema = z
  .object({
    session_date: z
      .string({
        required_error: "Session date is required",
      })
      .min(1, "Session date is required"),
    start_time: z
      .string({
        required_error: "Start time is required",
      })
      .min(1, "Start time is required"),
    end_time: z
      .string({
        required_error: "End time is required",
      })
      .min(1, "End time is required"),
  })
  .refine(
    (data) => {
      if (!data.session_date || !data.start_time || !data.end_time) return true;

      const sessionDate = new Date(data.session_date);
      const startTime = new Date(`${data.session_date}T${data.start_time}`);
      const endTime = new Date(`${data.session_date}T${data.end_time}`);

      return endTime > startTime;
    },
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

// Schema for API request (transforms strings to Date objects)
export const createSessionSchema = z.object({
  session_date: z.string().transform((val) => new Date(val)),
  start_time: z.string().transform((val) => new Date(val)),
  end_time: z.string().transform((val) => new Date(val)),
});

// Type for form data
export type CreateSessionFormData = z.infer<typeof createSessionFormSchema>;

// Type for API request
export type CreateSessionRequest = {
  id: number;
  data: z.infer<typeof createSessionSchema>;
};
