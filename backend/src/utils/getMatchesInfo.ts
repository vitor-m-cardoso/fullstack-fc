import IExtendedMatch from '../Interfaces/Matches/IExtendedMatch';
import { Match } from '../types';

const getMatchesInfo = (dbData: IExtendedMatch[]): Match[] => dbData
  .map((match) => ({
    id: match.id,
    homeTeamId: match.homeTeamId,
    homeTeamGoals: match.homeTeamGoals,
    awayTeamId: match.awayTeamId,
    awayTeamGoals: match.awayTeamGoals,
    inProgress: match.inProgress,
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
  }));

export default getMatchesInfo;
