import { Request, Response, NextFunction } from 'express';

const validateTeamsMatch = (req: Request, res: Response, next: NextFunction) => {
  const { homeTeamId, awayTeamId } = req.body;

  if (homeTeamId === awayTeamId) {
    return res
      .status(422)
      .json({ message: 'It is not possible to create a match with two equal teams' });
  }
  return next();
};

export default validateTeamsMatch;
