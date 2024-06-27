import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.ts';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  skills?: string;
  softwares?: string;
  renders?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public skills?: string;
  public softwares?: string;
  public renders?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
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
    allowNull: true,
    defaultValue: '',
    get() {
      const skills = this.getDataValue('skills');
      return skills ? skills.split(',') : [];
    },
    set(val: string[]) {
      this.setDataValue('skills', val.join(','));
    },
  },
  softwares: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
    get() {
      const softwares = this.getDataValue('softwares');
      return softwares ? softwares.split(',') : [];
    },
    set(val: string[]) {
      this.setDataValue('softwares', val.join(','));
    },
  },
  renders: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
    get() {
      const renders = this.getDataValue('renders');
      return renders ? renders.split(',') : [];
    },
    set(val: string[]) {
      this.setDataValue('renders', val.join(','));
    },
  },
}, {
  sequelize,
  modelName: 'User'
});

export default User;
