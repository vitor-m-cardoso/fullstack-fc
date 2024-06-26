import * as bcrypt from 'bcryptjs';
import * as jwt from '../utils/jwt';
import UsersModel from '../models/UserModel';
import IUserModel from '../Interfaces/Users';
import { ServiceResponse } from '../types/ServiceResponse';
import { Login, Token, UserRole } from '../types';
import { TokenPayload } from '../types/Token';

export default class UserService {
  constructor(private userModel: IUserModel = new UsersModel()) {}

  public async login(login: Login): Promise<ServiceResponse<Token>> {
    const user = await this.userModel.login(login);
    if (!user || !bcrypt.compareSync(login.password, user.password)) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role });

    return { status: 'SUCCESSFUL', data: { token } };
  }

  // eslint-disable-next-line class-methods-use-this
  public getUserRole(user: TokenPayload): ServiceResponse<UserRole> {
    return { status: 'SUCCESSFUL', data: { role: user.role } };
  }
}
