type Leaderboard = {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance?: number;
  efficiency?: string;
};

type LeaderboardHomeModel = {
  homeTeam: { teamName: string };
  homeTeamId: number;
  homeTeamGoals: number;
};

type LeaderboardAwayModel = {
  awayTeam: { teamName: string };
  awayTeamId: number;
  awayTeamGoals: number;
};

type Mode = 'home' | 'away';

export default Leaderboard;
export { LeaderboardHomeModel, LeaderboardAwayModel, Mode };
