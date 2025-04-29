import NextAuth from "next-auth";
import { authConfig } from "../../../src/auth.config"; // Corrected path

export default NextAuth(authConfig);
