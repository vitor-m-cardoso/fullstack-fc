import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeMatches from '../database/models/Matches';
import { orderedHomeMatches, allMatchesFromModel, orderedAwayMatches, orderedMatches } from './mocks/LeaderboardMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Route /leaderboard', () => {
  afterEach(()=>{
    sinon.restore();
  });

  it('Should return home matches ordered correctly', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatchesFromModel as any);

    const { status, body } = await chai.request(app).get('/leaderboard/home');

    expect(status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body).to.be.deep.equal(orderedHomeMatches);
  });

  it('Should return away matches ordered correctly', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatchesFromModel as any);

    const { status, body } = await chai.request(app).get('/leaderboard/away');

    expect(status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body).to.be.deep.equal(orderedAwayMatches);
  });

  it('Should return all matches ordered correctly', async () => {
    sinon.stub(SequelizeMatches, 'findAll').resolves(allMatchesFromModel as any);

    const { status, body } = await chai.request(app).get('/leaderboard');

    expect(status).to.be.equal(200);
    expect(body).to.be.an('array');
    expect(body).to.be.deep.equal(orderedMatches);
  });
});
