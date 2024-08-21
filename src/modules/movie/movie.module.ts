import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MovieService } from "./movie.service";
import { MovieController } from "./movie.controller";
import { MovieSchema } from "./movie.schema";
import { AuthModule } from "../auth/auth.module";
import { RedisService } from "../redis/redis.service";
import { RedisModule } from "../redis/redis.module";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Movie", schema: MovieSchema }]),
    AuthModule,
    RedisModule,
  ],
  providers: [MovieService, Logger, RedisService],
  controllers: [MovieController],
})
export class MovieModule {}
