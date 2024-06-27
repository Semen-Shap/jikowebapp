import express from 'express';
import cors from 'cors';
import { syncTable } from './database/database';
import taskRoutes from './database/routes/tasks';
import userRoutes from './database/routes/users';

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes)


app.post('/api/test', (req: any, res: any) => {
  console.log('sucess')
  res.json('test');
})

syncTable().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

export default app;