import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeMatches from '../database/models/Matches';
import { affectedRows, allMatchesFromModel, finishedMatch, matchFromModel, matchToFinish, matchToUpdate, matchesInProgress } from './mocks/MatchesMock';
import SequelizeUsers from '../database/models/Users';
import { userFromModel, userLogin } from './mocks/UsersMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Route /matches', () => {
  afterEach(()=>{
    sinon.restore();
  });

  it('Should return all matches correctly', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatchesFromModel as any);

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body).to.be.deep.equal(allMatchesFromModel);
  });

  it('Should return match with id=1 correctly', async () => {
    sinon.stub(SequelizeMatches, 'findOne').resolves(matchFromModel as any);

    const { status, body } = await chai.request(app).get('/matches/1');

    expect(status).to.be.equal(200);
    expect(body).to.be.a('object');
    expect(body).to.be.deep.equal(matchFromModel);
  });

  it('Should return an error message if match was not found', async () => {
    sinon.stub(SequelizeMatches, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/matches/9999');

    expect(status).to.be.equal(404);
    expect(body).to.be.a('object');
    expect(body).to.be.deep.equal({ message: 'Match not found' });
  });

  it('Should filter all matches in-progress', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatchesFromModel as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(matchesInProgress);
  });

  it('Should finish a match correctly', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    sinon.stub(SequelizeMatches, 'findOne').resolves(matchToFinish as any);
    sinon.stub(SequelizeMatches, 'update').resolves([affectedRows] as any);
    
    const response = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai
      .request(app)
      .patch('/matches/3/finish')
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal({ message: 'Finished' });
  });

  it('Should not finish a match already finished', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    sinon.stub(SequelizeMatches, 'findOne').resolves(finishedMatch as any);
    sinon.stub(SequelizeMatches, 'update').resolves([0] as any);
    
    const response = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai
      .request(app)
      .patch('/matches/1/finish')
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(status).to.be.equal(409);
    expect(body).to.be.deep.equal({ message: 'Match already finished' });
  });

  it('Should sucessfully update home and away team goals during an in-progress match', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    sinon.stub(SequelizeMatches, 'findOne').resolves(matchToUpdate as any);
    sinon.stub(SequelizeMatches, 'update').resolves([affectedRows] as any);
    
    const response = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai
      .request(app)
      .patch('/matches/3')
      .send({ homeTeamGoals: 3, awayTeamGoals: 1 })
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal({ homeTeamGoals: 3, awayTeamGoals: 1 });
  });

  it('Should return an error message if there was a problem to update a match', async () => {
    sinon.stub(SequelizeUsers, 'findOne').resolves(userFromModel as any);
    sinon.stub(SequelizeMatches, 'findOne').resolves(null);
    sinon.stub(SequelizeMatches, 'update').resolves([0] as any);
    
    const response = await chai.request(app).post('/login').send(userLogin);
    const { status, body } = await chai
      .request(app)
      .patch('/matches/2')
      .send({ homeTeamGoals: 3, awayTeamGoals: 1 })
      .set('Authorization', `Bearer ${response.body.token}`);

    expect(status).to.be.equal(409);
    expect(body).to.be.deep.equal({ message: 'Problem to update a match' });
  });
});
