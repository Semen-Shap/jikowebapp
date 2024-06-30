import { Router } from 'express';
import dotenv from 'dotenv';
import { PageObjectResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';
import { notion } from '../..';

dotenv.config();

const tasksRoutes = Router();

const databaseId = process.env.TASKS_DATABASE_ID;
if (!databaseId) throw new Error('Database Task not specified');


tasksRoutes.post('/', async (req, res) => {
    try {
        const { query, sort, limit } = req.body;
        let queryParams: QueryDatabaseParameters = {
            database_id: databaseId,
        };

        if (query && sort) {
            const filterCondition = (property: string) => {
                switch (property) {
                    case 'Title':
                        return {
                            property: property,
                            title: {
                                contains: query
                            }
                        };
                    case 'Status':
                        return {
                            property: property,
                            select: {
                                equals: query
                            }
                        };
                    case 'AssignedTo':
                        return {
                            property: property,
                            people: {
                                contains: query
                            }
                        };
                    case 'Tags':
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

        // Добавляем сортировку, если sort предоставлен
        if (sort) {
            queryParams.sorts = [
                {
                    property: sort,
                    direction: 'ascending'
                }
            ];
        }

        // Добавляем лимит, если limit предоставлен
        if (limit) {
            queryParams.page_size = limit;
        }

        const response = await notion.databases.query(queryParams);

        const tasks = response.results
            .filter((page): page is PageObjectResponse => 'properties' in page)
            .map((page) => {
                const properties = page.properties;

                const getTitle = (prop: any): string => {
                    if (prop.type === 'title' && prop.title.length > 0) {
                        return prop.title[0].plain_text;
                    }
                    return '';
                };

                const getStatus = (prop: any): string => {
                    if (prop.type === 'select') {
                        return prop.select?.name || '';
                    }
                    return '';
                };

                const getTags = (prop: any): string[] => {
                    if (prop.type === 'multi_select') {
                        return prop.multi_select.map((item: any) => item.name);
                    }
                    return [];
                };

                const getDate = (prop: any): string | null => {
                    if (prop.type === 'date') {
                        return prop.date?.start || null;
                    }
                    return null;
                };

                return {
                    id: page.id,
                    title: getTitle(properties.Title),
                    status: getStatus(properties.Status),
                    tags: getTags(properties.Tags),
                    deadline: getDate(properties.Deadline),
                };
            });

        res.json(tasks);
    } catch (error) {
        console.error('Error retrieving tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

tasksRoutes.post('/create', async (req, res) => {
    try {
        const { title, deadline, tags, status } = req.body;
        const properties = {
            ...(title && { Title: { title: [{ text: { content: title } }] } }),
            ...(deadline && { Deadline: { date: { start: deadline } } }),
            ...(tags && { Tags: { multi_select: tags.map((tag: string) => ({ name: tag })) } }),
            ...(status && { Status: { status: { name: status } } }),
        };

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: properties,
        });

        console.log("Success! Entry added:", response);
        res.json(response);
    } catch (error) {
        console.error("Error adding entry to database:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

tasksRoutes.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, deadline, tags, status } = req.body;
        const properties = {
            ...(title && { Title: { title: [{ text: { content: title } }] } }),
            ...(deadline && { Deadline: { date: { start: deadline } } }),
            ...(tags && { Tags: { multi_select: tags.map((tag: string) => ({ name: tag })) } }),
            ...(status && { Status: { status: { name: status } } }),
        };

        const response = await notion.pages.update({
            page_id: id,
            properties: properties,
        });

        console.log("Успех! Запись обновлена:", response);
        res.json(response);
    } catch (error) {
        console.error("Ошибка при обновлении записи в базе данных:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

tasksRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Archive the task (Notion does not support hard delete)
        const response = await notion.pages.update({
            page_id: id,
            archived: true,
        });

        console.log('Task deleted (archived) successfully:', response);
        res.json({ message: 'Task deleted (archived) successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default tasksRoutes;
