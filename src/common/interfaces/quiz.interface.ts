export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  duration: number;
  createdAt: Date;
  isActive: boolean;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Participant {
  id: string;
  userName: string;
  joinedAt: Date;
  score: number;
}

export interface UserAnswer {
  userId: string;
  questionIndex: number;
  answer: number;
  timestamp: Date;
  isCorrect: boolean;
}
