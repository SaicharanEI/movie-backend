import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { multerOptions } from '../multer-config';

@Injectable()
export class MulterInterceptor extends FileInterceptor(
  'image',
  multerOptions,
) {}
