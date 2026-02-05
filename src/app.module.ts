import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { QuizzModule } from './quizz/quizz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/quiz_db'),
    RedisModule, 
    QuizzModule
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
