import { Module, Global, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType, RedisClientOptions } from "redis";
import { RedisService } from "./redis.service";

@Global()
@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: async (
        configService: ConfigService
      ): Promise<RedisClientType> => {
        const options: RedisClientOptions = {
          password: configService.get<string>("REDIS_PASSWORD"),
          socket: {
            host: configService.get<string>("REDIS_HOST"),
            port: configService.get<number>("REDIS_PORT"),
          },
        };

        const client = createClient(options) as RedisClientType;

        client.on("error", (err) => {
          Logger.error("Redis error:", err.message);
        });

        client.on("connect", () => {
          Logger.log("RedisClient Connected to Redis");
        });

        await client.connect();

        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: RedisService,
      useClass: RedisService,
    },
  ],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
