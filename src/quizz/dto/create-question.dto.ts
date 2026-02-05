import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {
    @IsString()
    question: string;

    @IsArray()
    options: string[];

    @IsNumber()
    correctAnswer: number;
}