import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieModule } from './modules/movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserService } from './modules/user/user.service';
import { User, UserSchema } from './modules/user/user.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI, {
      dbName: 'movie',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MovieModule,
    AuthModule,
  ],
  controllers: [],
  providers: [UserService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly userService: UserService) {}
  async onModuleInit() {
    await this.userService.createDefaultUser('admin@gmail.com', '12345678');
  }
}
console.log(process.env.DB_URI);
