import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { ROLE } from "@/types";

export const authConfig: AuthOptions = {
  providers: [
    Credentials({
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "UGR/12345/12",
        },
        password: { label: "Password", type: "password" },
        type: {
          label: "type",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { username, password } = credentials;

        console.log("Authorizing user:", username);

        // when user login, he might be admin, instructor or student
        // so we need to check if the user exists in any of the three tables
        try {
          const user =
            (await prisma.admin.findUnique({ where: { uni_id: username } })) ||
            (await prisma.instructor.findUnique({
              where: { uni_id: username },
            })) ||
            (await prisma.student.findUnique({ where: { uni_id: username } }));
          if (!user) {
            console.log("User not found");
            return null;
          }
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            console.log("Invalid password");
            return null;
          }
          console.log("User authorized:", user);
          const full_name = user.first_name + " " + user.last_name;
          return {
            id: user.id,
            email: user.email,
            name: full_name,
            role: user.role as ROLE,
          };
        } catch (error) {
          throw new Error("Default");
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows redirects to the callbackUrl or any page within your base URL
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Fallback redirect to the homepage or a dashboard if no callbackUrl was provided
      // You might want to change "/" to "/dashboard" or "/home" depending on your default authenticated route
      return "/home";
    },
    jwt({ token, user }) {
      console.log("JWT callback:", token, user);
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.user.role = token.role as ROLE;
      }

      return session;
    },
  },
};
