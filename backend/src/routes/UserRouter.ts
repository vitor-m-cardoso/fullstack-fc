import { Request, Response, Router } from 'express';
import UserController from '../controllers/UserController';
import {
  validateEmail,
  validateLogin,
  validatePassword,
  validateToken,
} from '../middlewares/userMiddleware';

const usersValidations = [validateLogin, validateEmail, validatePassword];

const userRouter = Router();
const userController = new UserController();

userRouter.post(
  '/',
  usersValidations,
  (req: Request, res: Response) => userController.login(req, res),
);

userRouter.get(
  '/role',
  validateToken,
  (req: Request, res: Response) => userController.getUserRole(req, res),
);

export default userRouter;
