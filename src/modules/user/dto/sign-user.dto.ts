import { z } from "zod";

export const SignUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export type SignUserDto = z.infer<typeof SignUserSchema>;
