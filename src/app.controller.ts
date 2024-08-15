import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller("test")
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

// import { NestFactory } from "@nestjs/core";
// import { AppModule } from "./app.module";
// import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Swagger setup
//   const config = new DocumentBuilder()
//     .setTitle("Your API Title")
//     .setDescription("Your API description")
//     .setVersion("1.0")
//     .addTag("your-tag")
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup("api", app, document);

//   await app.listen(3000);
// }
// bootstrap();

// import { Controller, Get } from "@nestjs/common";
// import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

// @Controller("cats")
// @ApiTags("cats")
// export class CatsController {
//   @Get()
//   @ApiOperation({ summary: "Get all cats" })
//   @ApiResponse({ status: 200, description: "Returns all cats" })
//   getAllCats() {
//     // Your logic here
//   }
// }
