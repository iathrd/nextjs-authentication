import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  token: z.string(),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password length should be greater than 6",
  }),
});

export const twoFaSchema = z.object({
  pin: z.string().max(6, {
    message: "Invalid pin code",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
