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

export function generateRecoveryCode(): string {
  const codeLength = 5; // Length of each part of the recovery code
  const part1 = generateRandomString(codeLength); // Generate first part
  const part2 = generateRandomString(codeLength); // Generate second part
  return `${part1}-${part2}`;
}

export function generateRandomString(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}
