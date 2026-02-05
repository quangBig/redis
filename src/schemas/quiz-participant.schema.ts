import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class QuizParticipant extends Document {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

export const QuizParticipantSchema = SchemaFactory.createForClass(QuizParticipant);
