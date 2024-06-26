import { MatchToUpdate } from '../types/Match';
import IMatchModel from '../Interfaces/Matches/IMatchModel';
import MatchModel from '../models/MatchModel';
import { Match } from '../types';
import { ServiceResponse } from '../types/ServiceResponse';
import TeamModel from '../models/TeamModel';

export default class MatchService {
  constructor(private matchModel: IMatchModel = new MatchModel()) {}

  public async getAllMatches(): Promise<ServiceResponse<Match[]>> {
    const allMatches = await this.matchModel.findAll();
    return { status: 'SUCCESSFUL', data: allMatches };
  }

  // eslint-disable-next-line class-methods-use-this
  public getFilteredMatches(
    q: boolean,
    allMatches: Match[],
  ): ServiceResponse<Match[]> {
    const filteredMatches = allMatches.filter((match: Match) => match.inProgress === q);
    return { status: 'SUCCESSFUL', data: filteredMatches };
  }

  public async getMatchById(id: Match['id']): Promise<ServiceResponse<Match>> {
    const match = await this.matchModel.findOne(id);
    if (!match) {
      return { status: 'NOT_FOUND', data: { message: 'Match not found' } };
    }
    return { status: 'SUCCESSFUL', data: match };
  }

  public async finishMatch(id: Match['id']): Promise<ServiceResponse<{ message: string }>> {
    const finishedMatch = await this.matchModel.finishMatch(id);

    if (finishedMatch === null) {
      return { status: 'CONFLICT', data: { message: 'Match already finished' } };
    }

    return { status: 'SUCCESSFUL', data: { message: 'Finished' } };
  }

  public async updateMatch(matchToUpdate: MatchToUpdate): Promise<
  ServiceResponse<{ message: string }>> {
    const isMatchUpdated = await this.matchModel.updateMatch(matchToUpdate);

    if (!isMatchUpdated) {
      return { status: 'CONFLICT', data: { message: 'Problem to update a match' } };
    }

    return { status: 'SUCCESSFUL', data: { message: 'Match updated sucessfully' } };
  }

  public async createMatch(newMatch: Match): Promise<ServiceResponse<Match>> {
    const teamModel = new TeamModel();
    const homeTeam = await teamModel.findOne(newMatch.homeTeamId);
    const awayTeam = await teamModel.findOne(newMatch.awayTeamId);

    if (!homeTeam || !awayTeam) {
      return { status: 'NOT_FOUND', data: { message: 'There is no team with such id!' } };
    }

    const createdMatch = await this.matchModel.createMatch({ ...newMatch, inProgress: true });

    if (!createdMatch) {
      return { status: 'CONFLICT', data: { message: 'Problem while creating a match' } };
    }

    return { status: 'CREATED', data: createdMatch };
  }
}
