import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeUsers from '../database/models/Users';
import {
  userLogin,
  userFromModel,
  invalidUserLogin,
  invalidLoginPassword,
  invalidLoginEmail,
} from './mocks/UsersMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Route /login', () => {
  afterEach(()=>{
    sinon.restore();
  });

  it('Should login sucessfully with correct email and password', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);

    const { status, body } = await chai.request(app).post('/login').send(userLogin);

    expect(status).to.be.equal(200);
    expect(body).to.have.key('token');
  });

  it('Should return an error in case email or password is invalid', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);

    const { status, body } = await chai.request(app).post('/login').send(invalidUserLogin);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Should return an error in case email or password is missing', async () => {
    const { status, body } = await chai.request(app).post('/login').send({});

    expect(status).to.be.equal(400);
    expect(body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Should return an error in case email have invalid format', async () => {
    const { status, body } = await chai.request(app).post('/login').send(invalidLoginEmail);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Should return an error in case password have less than 6 characters long', async () => {
    const { status, body } = await chai.request(app).post('/login').send(invalidLoginPassword);

    expect(status).to.be.equal(401);
    expect(body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Should return user role if the token is sent correctly', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    const response = await chai.request(app).post('/login').send(userLogin);

    const { status, body } = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(status).to.be.equal(200);
    expect(body).to.be.a('object');
    expect(body).to.have.property('role');
    expect(body).to.be.deep.equal({ role: 'user' });
  });

  it('Should return an error message if token is not provided', async () => {
    const { status, body } = await chai.request(app).get('/login/role');

    expect(status).to.be.equal(401);
    expect(body).to.be.a('object');
    expect(body).not.to.have.property('role');
    expect(body).to.be.deep.equal({ message: 'Token not found' });
  });

  it('Should return an error message if token is not valid', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    const response = await chai.request(app).post('/login').send(userLogin);

    const { status, body } = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `${response.body.token}`);

    expect(status).to.be.equal(401);
    expect(body).to.be.a('object');
    expect(body).not.to.have.property('role');
    expect(body).to.be.deep.equal({ message: 'Token must be a valid token' });
  });

  it('Should return an error message if token have a incorrect format', async () => {
    const { status, body } = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `Bearer token`);

    expect(status).to.be.equal(401);
    expect(body).to.be.a('object');
    expect(body).not.to.have.property('role');
    expect(body).to.be.deep.equal({ message: 'Expired or invalid token' });
  });
});
