import { Router } from 'express';
import Meet from '../models/meetModel';

const meetsRoutes = Router();

meetsRoutes.post('/', async (req, res) => {
  const tasks = await Meet.findAll();
  res.json(tasks);
});

meetsRoutes.post('/create', async (req, res) => {
  const { name, date, time } = req.body;

  try {
    const task = await Meet.create({ name, date, time });
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

meetsRoutes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, date, time, userIds } = req.body;
  const task = await Meet.findByPk(id);
  if (task) {
    await task.update({ 
      name, 
      date, 
      time,
      userIds
     });
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

meetsRoutes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const task = await Meet.findByPk(id);
  if (task) {
    await task.destroy();
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

export default meetsRoutes;
