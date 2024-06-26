import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';
import SequelizeTeams from './Teams';

class SequelizeMatches extends Model<InferAttributes<SequelizeMatches>,
InferCreationAttributes<SequelizeMatches>> {
  declare id: CreationOptional<number>;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

SequelizeMatches.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: 'matches',
  timestamps: false,
  underscored: true,
});

SequelizeTeams.hasMany(SequelizeMatches, { foreignKey: 'homeTeamId', as: 'homeMatches' });
SequelizeMatches.belongsTo(SequelizeTeams, { foreignKey: 'homeTeamId', as: 'homeTeam' });

SequelizeTeams.hasMany(SequelizeMatches, { foreignKey: 'awayTeamId', as: 'awayMatches' });
SequelizeMatches.belongsTo(SequelizeTeams, { foreignKey: 'awayTeamId', as: 'awayTeam' });

export default SequelizeMatches;
