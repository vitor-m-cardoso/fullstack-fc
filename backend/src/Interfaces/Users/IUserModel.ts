import { Login, UserType } from '../../types';

export default interface IUserModel {
  login(login: Login): Promise<UserType | null>
}
