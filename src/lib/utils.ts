import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object to a time string in hh:mm AM/PM format
 * @param date - The Date object to format
 * @returns Formatted time string (hh:mm AM/PM)
 */
export function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a Date object to a date string in YYYY-MM-DD format
 * @param date - The Date object to format
 * @returns Formatted date string (YYYY-MM-DD)
 */
export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Formats a Date object to a datetime string in YYYY-MM-DD hh:mm AM/PM format
 * @param date - The Date object to format
 * @returns Formatted datetime string (YYYY-MM-DD hh:mm AM/PM)
 */
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}
