import { z } from "zod";

export const LoginUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  rememberMe: z.boolean(),
});

export type LoginUserDto = z.infer<typeof LoginUserSchema>;
