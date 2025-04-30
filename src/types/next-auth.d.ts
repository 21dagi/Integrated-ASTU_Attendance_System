import NextAuth from "next-auth"; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      role: "admin" | "instructor" | "student";
      image?: string;
    };
  }

  interface User {
    id: number;
    role: string; // Add custom fields from your database
    name: string;
    image?: string;
  }
}
