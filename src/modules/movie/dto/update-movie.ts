// src/modules/movie/dto/create-movie.dto.ts
import { z } from 'zod';

export const UpdateMovieSchema = z.object({
  title: z.string().nonempty('Title is required'),
  publishedYear: z
    .number()
    .int()
    .min(1900, 'Published year must be at least 1900'),
  image: z.string().optional(),
});

export type UpdateMovieDto = z.infer<typeof UpdateMovieSchema>;
