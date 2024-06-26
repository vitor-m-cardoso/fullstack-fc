import IExtendedMatch from '../Interfaces/Matches/IExtendedMatch';
import Leaderboard, { Mode } from '../types/Leaderboard';

export default class LeaderboardStatsCalculator {
  private teamName: string;
  private allTeams: IExtendedMatch[];
  private mode: Mode;

  constructor(teamName: string, allTeams: IExtendedMatch[], mode: Mode) {
    this.teamName = teamName;
    this.allTeams = allTeams;
    this.mode = mode;
  }

  private isHome(match: IExtendedMatch): boolean {
    return this.mode === 'home' && this.teamName === match.homeTeam.teamName;
  }

  private isAway(match: IExtendedMatch): boolean {
    return this.mode === 'away' && this.teamName === match.awayTeam.teamName;
  }

  private calculateTotalGames(): number {
    return this.allTeams
      .reduce((total, match) => total + (this.isHome(match) || this.isAway(match) ? 1 : 0), 0);
  }

  private calculateGoalsFavor(): number {
    return this.allTeams.reduce((total, match) => {
      if (this.isHome(match)) {
        return total + match.homeTeamGoals;
      }
      if (this.isAway(match)) {
        return total + match.awayTeamGoals;
      }
      return total;
    }, 0);
  }

  private calculateGoalsOwn(): number {
    return this.allTeams.reduce((total, match) => {
      if (this.isHome(match)) {
        return total + match.awayTeamGoals;
      }
      if (this.isAway(match)) {
        return total + match.homeTeamGoals;
      }
      return total;
    }, 0);
  }

  private calculateTotalPoints(): number {
    return this.allTeams.reduce((total, match) => {
      if (this.isHome(match)) {
        if (match.homeTeamGoals > match.awayTeamGoals) return total + 3;
        if (match.homeTeamGoals === match.awayTeamGoals) return total + 1;
      }
      if (this.isAway(match)) {
        if (match.awayTeamGoals > match.homeTeamGoals) return total + 3;
        if (match.awayTeamGoals === match.homeTeamGoals) return total + 1;
      }
      return total;
    }, 0);
  }

  private calculateTotalVictories(): number {
    return this.allTeams.reduce((total, match) => {
      if (this.isHome(match) && match.homeTeamGoals > match.awayTeamGoals) return total + 1;
      if (this.isAway(match) && match.awayTeamGoals > match.homeTeamGoals) return total + 1;
      return total;
    }, 0);
  }

  private calculateTotalDraws(): number {
    return this.allTeams.reduce((total, match) => {
      if ((this.isHome(match) || this.isAway(match))
        && match.homeTeamGoals === match.awayTeamGoals) {
        return total + 1;
      }
      return total;
    }, 0);
  }

  private calculateTotalLosses(): number {
    return this.allTeams.reduce((total, match) => {
      if (this.isHome(match) && match.homeTeamGoals < match.awayTeamGoals) return total + 1;
      if (this.isAway(match) && match.awayTeamGoals < match.homeTeamGoals) return total + 1;
      return total;
    }, 0);
  }

  // eslint-disable-next-line class-methods-use-this
  private calculateGoalsBalance(goalsFavor: number, goalsOwn: number): number {
    return goalsFavor - goalsOwn;
  }

  // eslint-disable-next-line class-methods-use-this
  private calculateEfficiency(totalPoints: number, totalGames: number): string {
    return ((totalPoints / (totalGames * 3)) * 100).toFixed(2);
  }

  calculateStats(): Leaderboard {
    const totalPoints = this.calculateTotalPoints();
    const totalGames = this.calculateTotalGames();
    const goalsFavor = this.calculateGoalsFavor();
    const goalsOwn = this.calculateGoalsOwn();
    return {
      name: this.teamName,
      totalPoints,
      totalGames,
      totalVictories: this.calculateTotalVictories(),
      totalDraws: this.calculateTotalDraws(),
      totalLosses: this.calculateTotalLosses(),
      goalsFavor,
      goalsOwn,
      goalsBalance: this.calculateGoalsBalance(goalsFavor, goalsOwn),
      efficiency: this.calculateEfficiency(totalPoints, totalGames),
    };
  }
}
