import SequelizeMatches from '../../database/models/Matches';

export default interface IExtendedMatch extends SequelizeMatches {
  homeTeam: {
    teamName: string;
  },
  awayTeam: {
    teamName: string;
  }
}
