export class QuestionDto {
  question: string;
  options: string[];
  index: number;
}

export class QuizResponseDto {
  id: string;
  title: string;
  currentQuestion?: QuestionDto;
  participants: number;
  timeRemaining: number;
  isActive: boolean;
  totalQuestions?: number;
}
