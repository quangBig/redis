import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class QuizSession extends Document {
  @Prop({ required: true })
  quizId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [MongooseSchema.Types.Mixed], required: true })
  questions: any[];

  @Prop({ default: 300000 }) // 5 minutes in ms
  duration: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.Date })
  startedAt: Date;

  @Prop({ type: MongooseSchema.Types.Date })
  endedAt: Date;
}

export const QuizSessionSchema = SchemaFactory.createForClass(QuizSession);
