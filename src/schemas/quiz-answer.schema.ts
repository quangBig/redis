import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuizAnswer extends Document {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  questionIndex: number;

  @Prop({ required: true })
  answer: number;

  @Prop({ required: true })
  isCorrect: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const QuizAnswerSchema = SchemaFactory.createForClass(QuizAnswer);
