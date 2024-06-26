import SequelizeTeams from '../database/models/Teams';
import { ITeam, ITeamModel } from '../Interfaces/Teams';

export default class TeamModel implements ITeamModel {
  constructor(private model = SequelizeTeams) {}

  async findAll(): Promise<ITeam[]> {
    const dbData = await this.model.findAll();
    return dbData.map(({ id, teamName }) => ({ id, teamName }));
  }

  async findOne(id: ITeam['id']): Promise<ITeam | null> {
    const dbData = await this.model.findByPk(id);
    if (dbData === null) return null;
    return dbData;
  }
}
