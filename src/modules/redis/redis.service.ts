import { Injectable, Inject } from "@nestjs/common";
import { RedisClientType } from "redis";

@Injectable()
export class RedisService {
  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: RedisClientType
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async setEx(key: string, time: number, value: string): Promise<void> {
    await this.redisClient.setEx(key, time, value);
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.redisClient.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => this.redisClient.del(key)));
    }
  }
}
