import { Match } from '../../types';

export default interface ILeaderboardModel {
  findAllTeams(): Promise<Match[]>
}
