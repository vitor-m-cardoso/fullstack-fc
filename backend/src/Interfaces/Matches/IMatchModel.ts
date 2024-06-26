import { MatchToUpdate } from '../../types/Match';
import { Match } from '../../types';

export default interface IMatchModel {
  findAll(): Promise<Match[]>;
  findOne(id: Match['id']): Promise<Match | null>;
  finishMatch(id: Match['id']): Promise<number | null>;
  updateMatch(matchToUpdate: MatchToUpdate): Promise<number | null>;
  createMatch(newMatch: Match): Promise<Match | null>;
}
