import { Match } from '../types';
import IMatchModel from '../Interfaces/Matches/IMatchModel';
import SequelizeMatches from '../database/models/Matches';
import SequelizeTeams from '../database/models/Teams';
import getMatchesInfo from '../utils/getMatchesInfo';
import IExtendedMatch from '../Interfaces/Matches/IExtendedMatch';
import { MatchToUpdate } from '../types/Match';

export default class MatchModel implements IMatchModel {
  constructor(private model = SequelizeMatches) {}

  async findAll(): Promise<Match[]> {
    const dbData = await this.model.findAll({
      include: [
        { model: SequelizeTeams, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return getMatchesInfo(dbData as IExtendedMatch[]);
  }

  async findOne(id: Match['id']): Promise<Match | null> {
    const match = await this.model.findOne({
      where: { id },
      include: [
        { model: SequelizeTeams, as: 'homeTeam', attributes: ['teamName'] },
        { model: SequelizeTeams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    if (!match) return null;

    return match;
  }

  async createMatch(newMatch: Match): Promise<Match | null> {
    const createdMatch = await this.model.create({ ...newMatch });

    return createdMatch;
  }

  async finishMatch(id: number): Promise<number | null> {
    const match = await this.findOne(id);

    if (match && !match.inProgress) return null;

    const [affectedCount] = await this.model.update(
      { inProgress: false },
      { where: { id } },
    );

    return affectedCount;
  }

  async updateMatch(matchToUpdate: MatchToUpdate): Promise<number | null> {
    const { id, awayTeamGoals, homeTeamGoals } = matchToUpdate;

    const match = await this.model.findByPk(id);

    if (!match || !match.inProgress) return null;

    const [affectedCount] = await this.model.update(
      { awayTeamGoals, homeTeamGoals },
      { where: { id } },
    );

    return affectedCount;
  }
}
