import { Router } from 'express';
import Task from '../models/taskModel';

const tasksRoutes = Router();

tasksRoutes.post('/', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

tasksRoutes.post('/create', async (req, res) => {
  const { name, deadline, tags, status } = req.body;

  try {
    const task = await Task.create({ name, deadline, tags, status });
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

tasksRoutes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, deadline, tags, status, completed } = req.body;
  const task = await Task.findByPk(id);
  if (task) {
    await task.update({ 
      name,
      deadline,
      status,
      tags,
     });
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

tasksRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByPk(id);
  if (task) {
    await task.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

export default tasksRoutes;
