import { Router } from 'express';
import User from '../models/userModel';
import { Op } from 'sequelize';

const userRoutes = Router();

userRoutes.post('/check', async (req, res) => {
    const { id } = req.body; // Получаем user_id из тела запроса
  
    try {
      const user = await User.findOne({
        where: {
          id
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
  

userRoutes.post('/create', async (req, res) => {
    const body = req.body;

    try {
        const user = await User.create({ 
            id: body.id,
            name: body.name,
            email: body.email,
            skills: body.skills,
            softwares: body.softwares,
            renders: body.renders
        });

        // Отправляем успешный ответ клиенту
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }

});

  
userRoutes.post('/', async (req, res) => {
    try {
        const { query } = req.body;
        const { sort } = req.body || 'name';
        const { limit } = req.body || 5;

        let users;

        if (query && query.trim() !== '') {
        // Если запрос не пустой, используем фильтрацию
        users = await User.findAll({
            where: {
            [sort]: {
            [Op.like]: `%${query}%`
            }},
            limit: limit // Ограничиваем результат до 5 пользователей
        });
        } else {
        // Если запрос пустой, возвращаем всех пользователей
            users = await User.findAll();
        
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('error:', error);
    }
});
  
export default userRoutes;