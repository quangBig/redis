export class LeaderboardResponseDto {
  quizId: string;
  rankings: Array<{
    rank: number;
    userName: string;
    score: number;
  }>;
}
