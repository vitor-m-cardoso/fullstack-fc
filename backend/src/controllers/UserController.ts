import { Request, Response } from 'express';
import UserService from '../services/UserService';
import mapStatusHTTP from '../utils/mapStatusHTTP';
import { TokenPayload } from '../types/Token';

export default class UserController {
  constructor(private userService = new UserService()) {}

  public async login(req: Request, res: Response) {
    const login = req.body;
    const { status, data } = await this.userService.login(login);
    return res.status(mapStatusHTTP(status)).json(data);
  }

  public getUserRole(_req: Request, res: Response) {
    const { status, data } = this.userService.getUserRole(res.locals as TokenPayload);
    return res.status(mapStatusHTTP(status)).json(data);
  }
}
