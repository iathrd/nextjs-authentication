import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAuthenticated() {
  const value =
    typeof window !== "undefined" && localStorage.getItem("userData");
  const user = value ? JSON.parse(value) : null;
  return user !== null;
}
