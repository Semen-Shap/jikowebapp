import { Router } from 'express';
import dotenv from 'dotenv';
import { notion } from '../..';
import { PageObjectResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints';

dotenv.config();

const meetRoutes = Router();

const databaseId = process.env.MEETS_DATABASE_ID;
if (!databaseId) throw new Error('Database Meet not specified');

export interface meetItem {
    title: string;
    date: string;
    users: string[];
}

// Get all meets with optional query, sort, and limit
meetRoutes.post('/', async (req, res) => {
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
                    case 'Date':
                        return {
                            property: property,
                            date: {
                                equals: query
                            }
                        };
                    case 'Users':
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

        // Adding sort if provided
        if (sort) {
            queryParams.sorts = [
                {
                    property: sort,
                    direction: 'ascending'
                }
            ];
        }

        // Adding limit if provided
        if (limit) {
            queryParams.page_size = limit;
        }

        const response = await notion.databases.query(queryParams);

        const meets = response.results
            .filter((page): page is PageObjectResponse => 'properties' in page)
            .map((page) => {
                const properties = page.properties;

                const getName = (prop: any): string => {
                    if (prop.type === 'title' && prop.title.length > 0) {
                        return prop.title[0].plain_text;
                    }
                    return '';
                };

                const getDate = (prop: any): string | null => {
                    if (prop.type === 'date') {
                        return prop.date?.start || null;
                    }
                    return null;
                };

                const getUsers = (prop: any): string[] => {
                    if (prop.type === 'relation') {
                        return prop.relation.map((rel: any) => rel.id || '');
                    }
                    return [];
                };
                return {
                    id: page.id,
                    name: getName(properties.Name),
                    date: getDate(properties.Date),
                    users: getUsers(properties.Users),
                };
            });
        res.json(meets);
    } catch (error) {
        console.error('Error retrieving meets:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new meet
meetRoutes.post('/create', async (req, res) => {
    
    try {
        const { name, date, users } = req.body;
        
        console.log(users);
        const properties = {
            ...(name && { Name: { title: [{ text: { content: name } }] } }),
            ...(date && { Date: { date: { start: date,  } } }),
            ...(users && { Users: { relation: users.map((page_id: string) => ({ id: page_id })) } }),
        };

        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: properties,
        });

        console.log("Success! Entry added:", response);
        res.json(response);
    } catch (error) {
        console.error("Error adding entry to database:", error);
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a meet
meetRoutes.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, users } = req.body;
        const properties = {
            ...(name && { Name: { title: [{ text: { content: name } }] } }),
            ...(date && { Date: { date: { start: date } } }),
            ...(users && { Users: { relation: users.map((page_id: string) => ({ id: page_id })) } }),
        };

        console.log(req.body)
        const response = await notion.pages.update({
            page_id: id,
            properties: properties,
        });

        console.log("Success! Entry updated:", response);
        res.json(response);
    } catch (error) {
        console.error("Error updating entry in database:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a meet (archive)
meetRoutes.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Archive the meet (Notion does not support hard delete)
        const response = await notion.pages.update({
            page_id: id,
            archived: true,
        });

        console.log('Meet deleted (archived) successfully:', response);
        res.json({ message: 'Meet deleted (archived) successfully' });
    } catch (error) {
        console.error('Error deleting meet:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default meetRoutes;
