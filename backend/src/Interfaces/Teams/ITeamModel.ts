import ITeam from './ITeam';

export default interface ITeamModel {
  findAll(): Promise<ITeam[]>,
  findOne(id: ITeam['id']): Promise<ITeam | null>
}
