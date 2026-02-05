export const REDIS_KEYS = {
  QUIZ: (id: string) => `quiz:${id}`,
  QUIZ_QUESTIONS: (id: string) => `quiz:${id}:questions`,
  QUIZ_PARTICIPANTS: (id: string) => `quiz:${id}:participants`,
  QUIZ_LEADERBOARD: (id: string) => `quiz:${id}:leaderboard`,
  USER_ANSWERS: (quizId: string, userId: string) => `quiz:${quizId}:user:${userId}:answers`,
  QUIZ_STATUS: (id: string) => `quiz:${id}:active`,
  QUIZ_START_TIME: (id: string) => `quiz:${id}:start_time`,
} as const;

export const REDIS_TTL = {
  QUIZ_DATA: 24 * 60 * 60, // 24 hours
  USER_ANSWERS: 2 * 60 * 60, // 2 hours
  LEADERBOARD: 24 * 60 * 60, // 24 hours
} as const;
