import { Request, Response, Router } from 'express';
import TeamController from '../controllers/TeamController';

const teamRouter = Router();

const teamController = new TeamController();

teamRouter.get('/:id', (req: Request, res: Response) => teamController.getTeamById(req, res));
teamRouter.get('/', (_req: Request, res: Response) => teamController.getAllTeams(_req, res));

export default teamRouter;
