import Task from "./models/taskModel";
import User from "./models/userModel";
import { sequelize } from './sequelize';


export async function syncTable() {
    await Task.sync();
    await User.sync();
    sequelize.sync();
}