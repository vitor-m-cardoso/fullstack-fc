import { Request, Response } from 'express';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import LeaderboardService from '../services/LeaderboardService';
import { Mode } from '../types/Leaderboard';

export default class LeaderboardController {
  constructor(private leaderboardService = new LeaderboardService()) {}

  public async getLeaderboardStats(req: Request, res: Response) {
    const mode = req.url.split('/')[1] as Mode;
    const { status, data } = await this.leaderboardService.calculateTeamStats(mode);

    return res.status(mapStatusHTTP(status)).json(data);
  }

  public async getAllTeamsStats(req: Request, res: Response) {
    const { status, data } = await this.leaderboardService.calculateAllTeamsStats();
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
