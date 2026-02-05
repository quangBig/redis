import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_KEYS, REDIS_TTL } from "./redis.constants";


@Injectable()
export class RedisService implements OnModuleInit {
   client: Redis;

   onModuleInit() {
      this.client = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6380'),
        password: process.env.REDIS_PASSWORD,
      });
   }
   // Quiz 
     async setQuiz(quizId: string, quizData: any) : Promise<void> {
          await this.client.hset(REDIS_KEYS.QUIZ(quizId), quizData);
          await this.client.expire(REDIS_KEYS.QUIZ(quizId), REDIS_TTL.QUIZ_DATA);
     }

     async getQuiz(quizId: string) : Promise<any> {
          return await this.client.hgetall(REDIS_KEYS.QUIZ(quizId));
     }
     // Quiz Questions
     async setQuestions(quizId: string, questions: any[]) : Promise<any> {
          const key = REDIS_KEYS.QUIZ_QUESTIONS(quizId);
          await this.client.del(key);
          await this.client.rpush(key, ...questions.map(q => JSON.stringify(q)));
          await this.client.expire(key, REDIS_TTL.QUIZ_DATA);
     } 

     async getQuestions(quizId: string): Promise<any[]> {
          const questions = await this.client.lrange(REDIS_KEYS.QUIZ_QUESTIONS(quizId), 0, -1);
          return questions.map(q => JSON.parse(q));
     }
          // Quiz Participants
     async addParticipant(quizId: string, userId: string): Promise<void> {
          await this.client.sadd(REDIS_KEYS.QUIZ_PARTICIPANTS(quizId), userId);
     }

     async getParticipants(quizId: string): Promise<string[]> {
          return await this.client.smembers(REDIS_KEYS.QUIZ_PARTICIPANTS(quizId));
     }

     async getParticipantsAcount(quizId: string): Promise<number> {
          return await this.client.scard(REDIS_KEYS.QUIZ_PARTICIPANTS(quizId));
     }

     // Quiz Leaderboard
     async updateScore(quizId: string, userId: string, score: number): Promise<void> {
          await this.client.zadd(REDIS_KEYS.QUIZ_LEADERBOARD(quizId), score, userId);
          await this.client.expire(REDIS_KEYS.QUIZ_LEADERBOARD(quizId), REDIS_TTL.LEADERBOARD);
     }

     async getLeaderboard(quizId: string, topN: number): Promise<{ userName: string; score: number }[]> {
          const leaderboard = await this.client.zrevrange(REDIS_KEYS.QUIZ_LEADERBOARD(quizId), 0, -1, 'WITHSCORES');
          const result: Array<{userName: string, score: number}> = [];
               for (let i = 0; i < leaderboard.length; i += 2) {
               result.push({
                    userName: leaderboard[i],
                    score: parseInt(leaderboard[i + 1])
               });
               }
          return result;
     }
     // Answer
     async submitAnswer(quizId: string, userId: string, answer: any): Promise<void> {
          const key = REDIS_KEYS.USER_ANSWERS(quizId, userId);
          await this.client.rpush(key, JSON.stringify(answer));
          await this.client.expire(key, REDIS_TTL.USER_ANSWERS);
     }

     async getuserAnswer(quizId: string, userId: string): Promise<any[]> {
          const answer = await this.client.lrange(REDIS_KEYS.USER_ANSWERS(quizId, userId), 0, -1);
          return answer.map(a => JSON.parse(a));
     }
   // Quizz status 
     async setQuizStatus(quizId: string, isActive: boolean): Promise<void> {
          await this.client.set(REDIS_KEYS.QUIZ_STATUS(quizId), isActive ? '1' : '0');
     }
     async getQuizStatus(quizId: string): Promise<boolean> {
          const status = await this.client.get(REDIS_KEYS.QUIZ_STATUS(quizId));
          return status === '1';
     }
     async setQuizzStartTime(quizId: string, startTime: number): Promise<void> {
          await this.client.set(REDIS_KEYS.QUIZ_START_TIME(quizId), startTime.toString());
     }
     async getQuizzStartTime(quizId: string): Promise<number | null> {
          const time = await this.client.get(REDIS_KEYS.QUIZ_START_TIME(quizId));
          return time ? parseInt(time) : null;
     }
     // Clear Data
     async deleteQuiz (quizId: string): Promise<void> {
          const key = [
               REDIS_KEYS.QUIZ(quizId),
               REDIS_KEYS.QUIZ_QUESTIONS(quizId),
               REDIS_KEYS.QUIZ_PARTICIPANTS(quizId),
               REDIS_KEYS.QUIZ_LEADERBOARD(quizId),
               REDIS_KEYS.QUIZ_STATUS(quizId),
               REDIS_KEYS.QUIZ_START_TIME(quizId)
          ]
          await this.client.del(...key);
     }

}

