import { PrismaClient } from "@prisma/client";

// Declare a global variable to hold the PrismaClient instance.
// This prevents multiple instances during development hot-reloading.
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    // Optional: Log Prisma operations during development
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

// In non-production environments, assign the instance to the global variable.
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
