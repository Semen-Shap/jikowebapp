import Task from "./models/task";
import User from "./models/user";
import { sequelize } from './sequelize';


export async function syncTable() {
    await Task.sync();
    await User.sync();
    sequelize.sync();
}