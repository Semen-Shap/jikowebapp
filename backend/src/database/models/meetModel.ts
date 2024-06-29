import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize'; // Подключение к вашей базе данных
import User from './userModel';

interface MeetAttributes {
  id?: number;
  name: string;
  completed?: boolean;
  date: Date | null;
  time: number;
  userIds?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Meet extends Model<MeetAttributes> implements MeetAttributes {
  public id?: number;
  public name!: string;
  public completed!: boolean;
  public date!: Date | null;
  public time!: number;
  public userIds?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Meet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    time: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
    userIds: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
          const userIds = this.getDataValue('userIds');
          return userIds ? userIds.split(',').map(Number) : [];
        },
        set(val: number[]) {
          this.setDataValue('userIds', val.join(','));
        },
      },
  },
  {
    sequelize,
    tableName: 'Meets',
  }
);

Meet.belongsToMany(User, { through: 'MeetUsers', as: 'users', foreignKey: 'meetId' });

export default Meet;
