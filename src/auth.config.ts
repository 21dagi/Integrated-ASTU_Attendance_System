import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

export const authConfig: AuthOptions = {
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
        if (!credentials) return null;

        const { email, password } = credentials;

        console.log("Authorizing user:", email);

        // Fetch the user from the database
        const user = await prisma.Admin.findUnique({ where: { email } });
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
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to the home page after successful login
      if (url === "/api/auth/signin") {
        return "/";
      }

      // Allow redirection to other internal URLs
      if (url.startsWith(baseUrl)) {
        return url;
      }

      // Default to the home page
      return "/";
    },
  },
};
