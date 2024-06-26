import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../sequelize.ts';

class Task extends Model {
  public id!: number;
  public name!: string;
  public desc!: string;
}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  desc: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deadline: {
    type: DataTypes.TIME,
  },
  category: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  points: {
    type: DataTypes.NUMBER,
  }
}, {
  sequelize,
  modelName: 'Task'
});

export default Task;
