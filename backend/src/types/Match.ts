type Match = {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
};

type MatchToUpdate = {
  id: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
};

export default Match;
export { MatchToUpdate };
