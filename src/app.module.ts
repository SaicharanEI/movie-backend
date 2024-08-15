import { Module, OnModuleInit } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieModule } from "./modules/movie/movie.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { UserService } from "./modules/user/user.service";
import { User, UserSchema } from "./modules/user/user.schema";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { APP_FILTER } from "@nestjs/core";
import { HttpExceptionFilter } from "./filter/http-exception.filter";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MovieModule,
    AuthModule,
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
        new winston.transports.File({
          filename: "logs/combined.log",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    UserService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}

  async onModuleInit() {
    await this.userService.createDefaultUser("admin@gmail.com", "12345678");
  }
}
