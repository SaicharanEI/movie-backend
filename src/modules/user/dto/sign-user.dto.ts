import { z } from 'zod';

export const SignUserSchema = z.object({
  email: z.string().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export type SignUserDto = z.infer<typeof SignUserSchema>;
