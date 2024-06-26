import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import MatchService from '../services/MatchService';
import { Match } from '../types';

export default class MatchController {
  constructor(private matchService = new MatchService()) {}

  public async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    let response = await this.matchService.getAllMatches();

    if (inProgress) {
      const querySearch = inProgress === 'true';
      response = this.matchService.getFilteredMatches(querySearch, response.data as Match[]);
    }

    return res.status(mapStatusHTTP(response.status)).json(response.data);
  }

  public async getMatchById(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.matchService.getMatchById(Number(id));
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { status, data } = await this.matchService.finishMatch(+id);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async updateMatch(req: Request, res: Response) {
    const {
      params: { id },
      body: { homeTeamGoals, awayTeamGoals },
    } = req;

    const { status, data } = await this.matchService
      .updateMatch({ id: Number(id), homeTeamGoals, awayTeamGoals });

    if (status !== 'SUCCESSFUL') {
      return res.status(mapStatusHTTP(status)).json(data);
    }
    return res.status(mapStatusHTTP(status)).json({ homeTeamGoals, awayTeamGoals });
  }

  public async createMatch(req: Request, res: Response) {
    const newMatch = req.body;

    const { status, data } = await this.matchService.createMatch(newMatch);

    if (status !== 'CREATED') {
      return res.status(mapStatusHTTP(status)).json(data);
    }
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
