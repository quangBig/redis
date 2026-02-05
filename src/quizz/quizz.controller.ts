import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JoinQuizDto } from './dto/join-quiz.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';

@Controller('quiz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createQuiz(@Body() body: { title: string; questions: CreateQuestionDto[] }) {
    const quizId = await this.quizzService.createQuiz(body.title, body.questions);
    return { quizId };
  }

  @Post(':quizId/start')
  @HttpCode(HttpStatus.OK)
  async startQuiz(@Param('quizId') quizId: string) {
    await this.quizzService.startQuiz(quizId);
    return { message: 'Quiz started successfully' };
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  async joinQuiz(@Body() joinQuizDto: JoinQuizDto) {
    await this.quizzService.joinQuiz(joinQuizDto);
    return { message: 'Joined quiz successfully' };
  }

  @Get(':quizId')
  async getQuiz(@Param('quizId') quizId: string) {
    return this.quizzService.getQuiz(quizId);
  }

  @Get(':quizId/question/:index')
  async getQuestion(@Param('quizId') quizId: string, @Param('index') questionIndex: number) {
    return this.quizzService.getQuestion(quizId, questionIndex);
  }

  @Post('submit-answer')
  @HttpCode(HttpStatus.OK)
  async submitAnswer(@Body() body: SubmitAnswerDto & { userName: string }) {
    const isCorrect = await this.quizzService.submitAnswer(body, body.userName);
    return { isCorrect };
  }

  @Get(':quizId/leaderboard')
  async getLeaderboard(@Param('quizId') quizId: string) {
    return this.quizzService.getLeaderboard(quizId);
  }

  @Post(':quizId/end')
  @HttpCode(HttpStatus.OK)
  async endQuiz(@Param('quizId') quizId: string) {
    await this.quizzService.endQuiz(quizId);
    return { message: 'Quiz ended successfully' };
  }

  @Post(':quizId/add-question')
  @HttpCode(HttpStatus.OK)
  async addQuestion(@Param('quizId') quizId: string, @Body() question: CreateQuestionDto) {
    await this.quizzService.addQuestion(quizId, question);
    return { message: 'Question added successfully' };
  }
}