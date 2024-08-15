import { Document } from "mongoose";

export interface Movie extends Document {
  title: string;
  publishedYear: number;
  image?: string;
}
