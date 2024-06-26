import SequelizeMatches from '../database/models/Matches';
import { ILeaderboardModel } from '../Interfaces/Leaderboard';
import SequelizeTeams from '../database/models/Teams';
import getMatchesInfo from '../utils/getMatchesInfo';
import IExtendedMatch from '../Interfaces/Matches/IExtendedMatch';
import { Match } from '../types';

export default class LeaderboardModel implements ILeaderboardModel {
  constructor(private model = SequelizeMatches) {}

  async findAllTeams(): Promise<Match[]> {
    const dbData = await this.model.findAll({
      where: { inProgress: false },
      include: [
        { model: SequelizeTeams, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return getMatchesInfo(dbData as IExtendedMatch[]);
  }
}
