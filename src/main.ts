import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WinstonModule } from "nest-winston";

import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./filter/http-exception.filter";

import { instance } from "./logger/winston.logger";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("Movie Application")
    .setDescription("Api for movie project")
    .setVersion("1.0")
    .addTag("movies")
    .addTag("auth")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  await app.listen(process.env.DB_PORT || 3009);
}
bootstrap();
