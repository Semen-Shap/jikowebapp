import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize'; // Подключение к вашей базе данных

interface TaskAttributes {
  id?: number;
  name: string;
  completed?: boolean;
  deadline: Date | null;
  tags: string; // Теги будут храниться как строка, разделенная запятой
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Task extends Model<TaskAttributes> implements TaskAttributes {
  public id!: number;
  public name!: string;
  public completed!: boolean;
  public deadline!: Date | null;
  public tags!: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
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
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING, // Используем строку для хранения тегов
      allowNull: true,
      defaultValue: '',
      get() {
        const tags = this.getDataValue('tags');
        return tags ? tags.split(',') : [];
      },
      set(val: string[]) {
        this.setDataValue('tags', val.join(','));
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending',
    },
  },
  {
    sequelize,
    tableName: 'Tasks',
  }
);

export default Task;
