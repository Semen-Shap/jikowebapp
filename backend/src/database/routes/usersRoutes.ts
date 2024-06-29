import { Router } from 'express';
import User from '../models/userModel';
import { Op } from 'sequelize';

const usersRoutes = Router();

usersRoutes.post('/check', async (req, res) => {
    const { id } = req.body; // Получаем user_id из тела запроса

    try {
      const user = await User.findOne({
        where: {
          id
        }
      });
      
      if (user) {
        console.log('User found');
        res.json({ exists: true, user });
      } else {
        console.log('User not found');
        res.json({ exists: false });
      }
    } catch (error) {
      console.error('Error in seatch user:', error);
      res.status(500).json({ error: 'Server check error' });
    }
  });
  

usersRoutes.post('/create', async (req, res) => {
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
        console.log('User created')
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', user });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }

});

  
usersRoutes.post('/', async (req, res) => {
    try {
        const { query } = req.body;
        const { sort } = req.body ;
        const { limit } = req.body || 5;

        let users;

        if (query && query.trim() !== '') {
          users = await User.findAll({
              where: {
              [sort]: {
                [Op.like]: `%${query}%`
              }},
              limit: limit
          });
        } else {
            users = await User.findAll();
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('error:', error);
    }
});
  
export default usersRoutes;