import { Request, Response, Router } from 'express';
import MatchController from '../controllers/MatchController';
import { validateToken } from '../middlewares/userMiddleware';
import validateTeamsMatch from '../middlewares/validateTeamsMatch';

const matchRouter = Router();

const matchController = new MatchController();

matchRouter.get('/:id', (req: Request, res: Response) => matchController.getMatchById(req, res));
matchRouter.get('/', (_req: Request, res: Response) => matchController.getAllMatches(_req, res));

matchRouter
  .post(
    '/',
    validateToken,
    validateTeamsMatch,
    (req: Request, res: Response) => matchController.createMatch(req, res),
  );

matchRouter
  .patch(
    '/:id/finish',
    validateToken,
    (req: Request, res: Response) => matchController.finishMatch(req, res),
  );
matchRouter
  .patch(
    '/:id',
    validateToken,
    (req: Request, res: Response) => matchController.updateMatch(req, res),
  );

export default matchRouter;
