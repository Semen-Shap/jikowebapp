import { Router } from 'express';
import { addToDatabase, findUser, getAllObjectsFromDatabase } from '../../shared/api/databaseApi';
import dotenv from "dotenv";
import { UserModel } from '../models/userModel';

dotenv.config();

const usersRoutes = Router();

const databaseId = process.env.USERS_DATABASE_ID;
if (!databaseId) throw console.error('Database ID not specified');


usersRoutes.post('/', async (req, res) => {
    const users = getAllObjectsFromDatabase(databaseId);
    
    res.json(users)
});

usersRoutes.post('/check', async (req, res) => {
    const { id } = req.body; // Получаем user_id из тела запроса

    try {
      const user = await findUser(databaseId, 'TelegramId', id);
      
      if (user) {
        res.json({ exists: true, user });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error in seatch user:', error);
      res.status(500).json({ error: 'Server check error' });
    }
  });

  
usersRoutes.post('/create', async (req, res) => {
    const { name, email, id, skills, softwares, renders} = req.body;

    try {
        const user = addToDatabase(databaseId, UserModel({
            name,
            email,
            id,
            skills,
            softwares,
            renders
        }));

        // Отправляем успешный ответ клиенту
        console.log('User created')
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

usersRoutes.put('/:id', async (req, res) => {
  
});

usersRoutes.delete('/:id', async (req, res) => {
  
});

export default usersRoutes;
