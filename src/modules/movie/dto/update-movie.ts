import { z } from "zod";

export const UpdateMovieSchema = z.object({
  title: z.string(),
  publishedYear: z
    .number()
    .int()
    .min(1600, "Published year must be at least 1900"),
  image: z.string().optional(),
});

export type UpdateMovieDto = z.infer<typeof UpdateMovieSchema>;
