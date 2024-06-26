import SequelizeUsers from '../database/models/Users';
import IUserModel from '../Interfaces/Users';
import { Login, UserType } from '../types';

export default class UsersModel implements IUserModel {
  constructor(private model = SequelizeUsers) {}

  async login(login: Login): Promise<UserType | null> {
    const { email } = login;
    const user = await this.model.findOne({ where: { email } });

    return user;
  }
}
