"use server";

import { signIn } from "@/auth";
import AuthError from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  const { email, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { email, password });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error("Invalid credentials.");
    }
    throw error;
  }
}
