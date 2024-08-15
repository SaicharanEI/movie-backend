import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Movie {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop()
  publishedYear: number;

  @Prop()
  image: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
