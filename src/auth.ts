import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

export const { signIn, signOut, auth } = NextAuth(authConfig);
