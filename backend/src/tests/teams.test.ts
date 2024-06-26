import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import SequelizeTeams from '../database/models/Teams';
import { allTeamsFromModel, oneTeamFromModel } from './mocks/TeamsMock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Route /teams', () => {
  afterEach(()=>{
    sinon.restore();
  });

  it('Should return all teams correctly', async () => {
    sinon.stub(SequelizeTeams, 'findAll').resolves(allTeamsFromModel as any);

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(allTeamsFromModel);
  });

  it('Should return team with id=1 correctly', async () => {
    sinon.stub(SequelizeTeams, 'findByPk').resolves(oneTeamFromModel as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.be.equal(200);
    expect(body).to.be.deep.equal(oneTeamFromModel);
  });

  it('Should return an error message with incorrect id', async () => {
    sinon.stub(SequelizeTeams, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/99993');

    expect(status).to.be.equal(404);
    expect(body).to.be.deep.equal({ message: 'Team not found' });
  });
});
