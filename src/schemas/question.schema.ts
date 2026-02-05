import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ required: true })
  correctAnswer: number;

  @Prop({ default: 30 })
  timeLimit: number;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
