import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validate credentials using zod
        const credentialsSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Fetch the user from the database
        const user = await prisma.Admin.findUnique({
          where: { email },
        });

        if (!user) {
          console.log("User not found");
          return null;
        }

        // Compare the provided password with the hashed password in the database
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          console.log("Invalid password");
          return null;
        }

        // Return the user object if authentication is successful
        return {
          id: user.id,
          email: user.email,
          name: user.name, // Assuming the `admins` table has a `name` column
        };
      },
    }),
  ],
});
