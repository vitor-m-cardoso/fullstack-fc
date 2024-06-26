import { Login, UserType, Token } from '../../types';

const userLogin: Login = {
  email: 'user@user.com',
  password: 'secret_user'
}

const invalidUserLogin: Login = {
  email: 'user@user.com',
  password: '1234123124',
}

const invalidLoginPassword: Login = {
  email: 'user@user.com',
  password: '123',
};

const invalidLoginEmail: Login = {
  email: '@exemplo.com',
  password: 'secret_user',
};

const userFromModel: UserType = {
  id: 2,
  username: 'User',
  role: 'user',
  email: 'user@user.com',
  password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
}

export {
  userLogin,
  userFromModel,
  invalidUserLogin,
  invalidLoginPassword,
  invalidLoginEmail,
}
