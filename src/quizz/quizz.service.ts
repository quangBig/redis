import { Injectable } from "@nestjs/common";
import { RedisService } from "src/redis/redis.service";
import { CreateQuestionDto } from "./dto/create-question.dto";
import { LeaderboardResponseDto } from "./dto/leaderboard-response.dto";
import { SubmitAnswerDto } from "./dto/submit-answer.dto";
import { QuestionDto, QuizResponseDto } from "./dto/quiz-response.dto";
import { JoinQuizDto } from "./dto/join-quiz.dto";


@Injectable()
export class QuizzService {
  constructor(private readonly redisService: RedisService) {}

  async createQuiz(title: string, questions: CreateQuestionDto[]): Promise<string> {
    const quizId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.redisService.setQuiz(quizId, { title, createdAt: new Date().toISOString() });
    await this.redisService.setQuestions(quizId, questions);
    await this.redisService.setQuizStatus(quizId, false);
    
    return quizId;
  }

  async startQuiz(quizId: string): Promise<void> {
    await this.redisService.setQuizStatus(quizId, true);
    await this.redisService.setQuizzStartTime(quizId, Date.now());
  }

  async joinQuiz(joinQuizDto: JoinQuizDto): Promise<void> {
    await this.redisService.addParticipant(joinQuizDto.quizId, joinQuizDto.userName);
  }

  async getQuiz(quizId: string): Promise<QuizResponseDto | null> {
    const quizData = await this.redisService.getQuiz(quizId);
    if (!quizData) return null;

    const questions = await this.redisService.getQuestions(quizId);
    const participants = await this.redisService.getParticipantsAcount(quizId);
    const isActive = await this.redisService.getQuizStatus(quizId);
    const startTime = await this.redisService.getQuizzStartTime(quizId);
    
    const timeRemaining = startTime ? Math.max(0, 300000 - (Date.now() - startTime)) : 0;

    return {
      id: quizId,
      title: quizData.title,
      currentQuestion: questions[0] ? {
        question: questions[0].question,
        options: questions[0].options,
        index: 0
      } : undefined,
      participants,
      timeRemaining,
      isActive
    };
  }

  async getQuestion(quizId: string, questionIndex: number): Promise<QuestionDto | null> {
    const questions = await this.redisService.getQuestions(quizId);
    if (questionIndex >= questions.length) return null;

    return {
      question: questions[questionIndex].question,
      options: questions[questionIndex].options,
      index: questionIndex
    };
  }

  async submitAnswer(submitAnswerDto: SubmitAnswerDto, userName: string): Promise<boolean> {
    const questions = await this.redisService.getQuestions(submitAnswerDto.quizId);
    if (submitAnswerDto.questionIndex >= questions.length) return false;

    const question = questions[submitAnswerDto.questionIndex];
    const isCorrect = question.correctAnswer === submitAnswerDto.answer;

    await this.redisService.submitAnswer(submitAnswerDto.quizId, userName, {
      questionIndex: submitAnswerDto.questionIndex,
      answer: submitAnswerDto.answer,
      isCorrect,
      timestamp: new Date().toISOString()
    });

    if (isCorrect) {
      const currentScore = await this.getUserScore(submitAnswerDto.quizId, userName);
      await this.redisService.updateScore(submitAnswerDto.quizId, userName, currentScore + 10);
    }

    return isCorrect;
  }

  async getLeaderboard(quizId: string): Promise<LeaderboardResponseDto> {
    const leaderboard = await this.redisService.getLeaderboard(quizId, 10);
    
    return {
      quizId,
      rankings: leaderboard.map((entry, index) => ({
        rank: index + 1,
        userName: entry.userName,
        score: entry.score
      }))
    };
  }

  private async getUserScore(quizId: string, userName: string): Promise<number> {
    const leaderboard = await this.redisService.getLeaderboard(quizId, 1);
    const userEntry = leaderboard.find(entry => entry.userName === userName);
    return userEntry ? userEntry.score : 0;
  }

  async endQuiz(quizId: string): Promise<void> {
    await this.redisService.setQuizStatus(quizId, false);
  }

  async addQuestion(quizId: string, question: CreateQuestionDto): Promise<void> {
    const questions = await this.redisService.getQuestions(quizId);
    questions.push(question);
    await this.redisService.setQuestions(quizId, questions);
  }
}