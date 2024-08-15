import { PipeTransform, Injectable, BadRequestException } from "@nestjs/common";
import { z } from "zod";

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: z.ZodSchema<T>) {}

  transform(value: any): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(
        result.error.errors.map((e) => e.message).join(", "),
      );
    }
    return result.data;
  }
}
