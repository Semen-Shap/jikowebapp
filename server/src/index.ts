import express from 'express';
import cors from 'cors';
import User from './database/models/user';
import { syncTable } from './database/database';


const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());


app.post('/api/users/check', async (req, res) => {
  const { user_id } = req.body; // Получаем user_id из тела запроса

  try {
    const user = await User.findOne({
      where: {
        id: user_id
      }
    });
    
    if (user) {
      // Пользователь найден
      res.json({ exists: true, user });
    } else {
      // Пользователь не найден
      console.log('User not found');
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Ошибка при поиске пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.post('/api/users/create', async (req, res) => {
  const body = req.body;

  try {
    const user = await User.create({ 
      id: body.user_id,
      name: body.name,
      email: body.email,
      skills: JSON.stringify(body.skills),
      softwares: JSON.stringify(body.softwares),
      renders: JSON.stringify(body.renders)
    });
  
    // Отправляем успешный ответ клиенту
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
  
});


app.post('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('error:', error);
  }
});


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