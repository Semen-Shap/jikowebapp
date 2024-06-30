import { Router } from 'express';
import dotenv from "dotenv";
import { UserModel } from '../models/userModel';
import { notion } from "../..";
import { PageObjectResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import tasksRoutes from './taskRoutes';

dotenv.config();

const usersRoutes = Router();

const databaseId = process.env.USERS_DATABASE_ID;
if (!databaseId) throw console.error('Database ID not specified');


usersRoutes.post('/', async (req, res) => {
    try {
        const { query, sort, limit } = req.body;
        let queryParams: QueryDatabaseParameters = {
            database_id: databaseId,
        };

        if (query && sort) {
            const filterCondition = (property: string) => {
                switch (property) {
                    case 'Name':
                        return {
                            property: property,
                            title: {
                                contains: query
                            }
                        };
                    case 'Email':
                        return {
                            property: property,
                            email: {
                                contains: query
                            }
                        };
                    case 'Skills':
                    case 'Softwares':
                    case 'Renders':
                        return {
                            property: property,
                            multi_select: {
                                contains: query
                            }
                        };
                    default:
                        return {
                            property: property,
                            rich_text: {
                                contains: query
                            }
                        };
                }
            };
        
            queryParams.filter = {
                or: [filterCondition(sort)]
            };
        }

        // Добавляем лимит, если limit предоставлен
        if (limit) {
            queryParams.page_size = limit;
        }

        const response = await notion.databases.query(queryParams);

        const users = response.results
            .filter((page): page is PageObjectResponse => 'properties' in page)
            .map((page) => {
                const properties = page.properties;

                const getName = (prop: any): string => {
                    if (prop.type === 'title' && prop.title.length > 0) {
                        return prop.title[0].plain_text;
                    }
                    return '';
                };

                const getEmail = (prop: any): string => {
                    if (prop.type === 'email') {
                        return prop.email || '';
                    }
                    return '';
                };

                const getMultiSelect = (prop: any): string[] => {
                    if (prop.type === 'multi_select') {
                        return prop.multi_select.map((item: any) => item.name);
                    }
                    return [];
                };

                const getNumber = (prop: any): number | null => { 
                    if (prop.type === 'number') {
                        return prop.number || null;
                    }
                    return null;
                };

                return {
                    name: getName(properties.Name),
                    email: getEmail(properties.Email),
                    id: getNumber(properties.TelegramId),
                    skills: getMultiSelect(properties.Skills),
                    softwares: getMultiSelect(properties.Softwares),
                    renders: getMultiSelect(properties.Renders),
                };
            });

        res.json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



usersRoutes.post('/check', async (req, res) => {
    const { id } = req.body; // Получаем user_id из тела запроса

    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'TelegramId',
                number: {
                    equals: id
                }
            },
            page_size: 1 // Ограничиваем результат одной записью
        });

        if (response.results.length > 0) {
            console.log("Пользователь найден:", response.results[0]);
            res.json({ exists: true, user: response.results[0] });
        } else {
            console.log("Пользователь не найден");
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Ошибка при поиске пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера при проверке' });
    }
});
  


usersRoutes.post('/create', async (req, res) => {
    const { name, email, id, skills, softwares, renders } = req.body;

    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: UserModel({
                name,
                email,
                id,
                skills,
                softwares,
                renders
            }),
        });

        console.log("Success! Entry added:", response);

        // Отправляем успешный ответ клиенту
        console.log('User created');
        res.status(201).json({ message: 'Пользователь успешно зарегистрирован', response });
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

usersRoutes.post('/:id/name', async (req, res) => {
    try {
        const { id } = req.params;

        // Получение данных страницы
        const response = await notion.pages.retrieve({ page_id: id });

        // Проверка, содержит ли ответ свойство properties
        if ('properties' in response) {
            const properties = response.properties;

            // Извлечение имени страницы
            const getName = (properties: any): string => {
                if (properties.Name && properties.Name.type === 'title' && properties.Name.title.length > 0) {
                    return properties.Name.title[0].plain_text;
                }
                return '';
            };

            const name = getName(properties);
            res.json({ name });
        } else {
            res.status(400).json({ error: 'Invalid page response' });
        }
    } catch (error) {
        console.error('Error retrieving page name:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


export default usersRoutes;
