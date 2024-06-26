import { Leaderboard } from '../types';

const orderLeaderboard = (homeLeaderboard: Leaderboard[]): Leaderboard[] => homeLeaderboard
  .sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
    if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
    if ((b.goalsBalance ?? 0) !== (a.goalsBalance ?? 0)) {
      return (b.goalsBalance ?? 0) - (a.goalsBalance ?? 0);
    }
    return b.goalsFavor - a.goalsFavor;
  });

export default orderLeaderboard;
