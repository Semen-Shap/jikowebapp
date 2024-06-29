import { Router } from 'express';
import { addToDatabase, getAllObjectsFromDatabase } from '../../shared/api/databaseApi';
import dotenv from "dotenv";
import { TaskModel } from '../models/taskModel';

dotenv.config();

const tasksRoutes = Router();

const databaseId = process.env.TASKS_DATABASE_ID;
if (!databaseId) throw console.error('Database Task not specified');


tasksRoutes.post('/', async (req, res) => {
    const tasks = getAllObjectsFromDatabase(databaseId);

    res.json(tasks);
});

tasksRoutes.post('/create', async (req, res) => {
    const { title, deadline, tags, status } = req.body;
    const task = addToDatabase(databaseId, TaskModel({
        title,
        deadline,
        tags,
        status,
    }));

    res.json(task);
});

tasksRoutes.put('/:id', async (req, res) => {
  
});

tasksRoutes.delete('/:id', async (req, res) => {
  
});

export default tasksRoutes;
