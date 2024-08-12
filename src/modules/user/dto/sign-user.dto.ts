import { z } from 'zod';

export const SignUserSchema = z.object({
  username: z.string().nonempty('Username is required'),
  password: z.string().nonempty('Password is required'),
});

export type SignUserDto = z.infer<typeof SignUserSchema>;
