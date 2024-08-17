import { Injectable } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../config/multer-config";

@Injectable()
export class MulterInterceptor extends FileInterceptor(
  "image",
  multerOptions,
) {}
