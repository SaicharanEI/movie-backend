import { z } from "zod";

export const CreateMovieSchema = z.object({
  userId: z.string(),
  title: z.string().nonempty("Title is required"),
  publishedYear: z
    .number()
    .int()
    .min(1900, "Published year must be at least 1900"),
  image: z.string().optional(),
});

export type CreateMovieDto = z.infer<typeof CreateMovieSchema>;
