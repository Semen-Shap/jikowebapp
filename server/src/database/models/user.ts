import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.ts';

class User extends Model {
  public id!: number;
  public name!: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  skills: {
    type: DataTypes.STRING,
  },
  softwares: {
    type: DataTypes.STRING,
  },
  renders: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'User'
});

export default User;
