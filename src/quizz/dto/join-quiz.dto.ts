import { IsString } from "class-validator";

export class JoinQuizDto {
  @IsString()
  quizId: string;

  @IsString()
  userName: string;
}
