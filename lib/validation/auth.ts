import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
  password: z.string().min(12, "Password must be at least 12 characters.").max(200, "Password is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    confirmPassword: z.string().min(1, "Confirm your password."),
    email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
    name: z.string().trim().min(2, "Enter your name.").max(80, "Name is too long."),
    password: z.string().min(12, "Password must be at least 12 characters.").max(200, "Password is too long."),
  })
  .refine((input) => input.password === input.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
