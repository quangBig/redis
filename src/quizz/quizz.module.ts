import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizzController } from './quizz.controller';
import { QuizzService } from './quizz.service';
import { Quiz, QuizSchema } from '../schemas/quiz.schema';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }])
  ],
  controllers: [QuizzController],
  providers: [QuizzService],
  exports: [QuizzService],
})
export class QuizzModule {}