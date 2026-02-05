import { IsNumber, IsString } from "class-validator";

export class SubmitAnswerDto {
  @IsString()
  quizId: string;

  @IsNumber()
  questionIndex: number;

  @IsNumber()
  answer: number;
}
