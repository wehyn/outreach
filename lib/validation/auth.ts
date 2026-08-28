import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(320, "Email is too long."),
  password: z.string().min(12, "Password must be at least 12 characters.").max(200, "Password is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;
