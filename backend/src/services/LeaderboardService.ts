import { ServiceResponse } from '../types/ServiceResponse';
import LeaderboardModel from '../models/LeaderboardModel';
import { Leaderboard } from '../types';
import IExtendedMatch from '../Interfaces/Matches/IExtendedMatch';
import LeaderboardStatsCalculator from './LeaderboardStatsCalculator';
import orderLeaderboard from '../utils/orderLeaderboard';

export default class LeaderboardService {
  constructor(private leaderboardModel = new LeaderboardModel()) {}

  async calculateTeamStats(mode: 'home' | 'away'): Promise<ServiceResponse<Leaderboard[]>> {
    const allTeams = await this.leaderboardModel.findAllTeams() as IExtendedMatch[];
    const teamNames = Array
      .from(new Set(allTeams
        .map((team) => (mode === 'home' ? team.homeTeam.teamName : team.awayTeam.teamName))));
    const teamsLeaderboard = teamNames.map((teamName) => {
      const teamStatsCalculator = new LeaderboardStatsCalculator(teamName, allTeams, mode);
      return teamStatsCalculator.calculateStats();
    });
    const ordenedLeaderboard = orderLeaderboard(teamsLeaderboard);
    return { status: 'SUCCESSFUL', data: ordenedLeaderboard };
  }

  // eslint-disable-next-line class-methods-use-this
  calculateCombinedStatsForTeam(teamName: string, allTeams: IExtendedMatch[]): Leaderboard {
    const homeStatsCalculator = new LeaderboardStatsCalculator(teamName, allTeams, 'home');
    const awayStatsCalculator = new LeaderboardStatsCalculator(teamName, allTeams, 'away');
    const homeStats = homeStatsCalculator.calculateStats();
    const awayStats = awayStatsCalculator.calculateStats();
    return {
      name: teamName,
      goalsFavor: homeStats.goalsFavor + awayStats.goalsFavor,
      goalsOwn: homeStats.goalsOwn + awayStats.goalsOwn,
      totalPoints: homeStats.totalPoints + awayStats.totalPoints,
      totalGames: homeStats.totalGames + awayStats.totalGames,
      totalVictories: homeStats.totalVictories + awayStats.totalVictories,
      totalDraws: homeStats.totalDraws + awayStats.totalDraws,
      totalLosses: homeStats.totalLosses + awayStats.totalLosses,
      goalsBalance: (homeStats.goalsFavor + awayStats.goalsFavor)
        - (homeStats.goalsOwn + awayStats.goalsOwn),
      efficiency: (((homeStats.totalPoints + awayStats.totalPoints)
        / ((homeStats.totalGames + awayStats.totalGames) * 3)) * 100).toFixed(2),
    };
  }

  async calculateAllTeamsStats(): Promise<ServiceResponse<Leaderboard[]>> {
    const allTeams = await this.leaderboardModel.findAllTeams() as IExtendedMatch[];
    const teamNames = Array.from(new Set(allTeams
      .flatMap((match) => [match.homeTeam.teamName, match.awayTeam.teamName])));
    const leaderboard = teamNames
      .map((teamName) => this.calculateCombinedStatsForTeam(teamName, allTeams));
    const ordenedLeaderboard = orderLeaderboard(leaderboard);
    return { status: 'SUCCESSFUL', data: ordenedLeaderboard };
  }
}
