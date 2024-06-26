import { Router } from 'express';

import teamRouter from './TeamRouter';
import userRouter from './UserRouter';
import matchRouter from './MatchRouter';
import leaderboardRouter from './LeaderboardRouter';

const router = Router();

router.use('/login', userRouter);
router.use('/teams', teamRouter);
router.use('/matches', matchRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;
