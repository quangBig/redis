import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { CreateQuestionDto } from "./create-question.dto";

export class CreateQuizzDto {
    @IsString()
    title: string;

    @IsArray()
    @ValidateNested({each: true})
    questions: CreateQuestionDto[];

    @IsNumber()
    duration: number;

}