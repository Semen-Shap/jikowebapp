import { notion } from "../..";

// Function to add an entry to the database
export async function addToDatabase(databaseId: string, properties: any) {
    try {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: properties,
      });
      console.log("Success! Entry added:", response);
    } catch (error) {
      console.error("Error adding entry to database:", error);
    }
  }
  

// Функция для поиска пользователя по параметру
export async function findUser(
  databaseId: string, 
  parameterName: string, 
  parameterValue: number
) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: parameterName,
        number: {
          equals: parameterValue
        }
      },
      page_size: 1 // Ограничиваем результат одной записью
    });

    if (response.results.length > 0) {
      console.log("Пользователь найден:", response.results[0]);
      return response.results[0];
    } else {
      console.log("Пользователь не найден");
      return null;
    }
  } catch (error) {
    console.error("Ошибка при поиске пользователя:", error);
    return null;
  }
}


// Function to get all objects from the database
export async function getAllObjectsFromDatabase(databaseId: string, filter?: string) {
    try {
        let users: any[] = [];
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
        const response = await notion.databases.query({
            database_id: databaseId,
            start_cursor: startCursor,
        });

        users = users.concat(response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor ?? undefined;
        }

        //console.log("Success! Retrieved all objects from database:", users);
        return users;
    } catch (error) {
        console.error("Error retrieving objects from database:", error);
    }
}

// Функция для обновления записи в базе данных
export async function updateDatabaseObject(pageId: string, properties: any) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: properties,
    });
    console.log("Успех! Запись обновлена:", response);
  } catch (error) {
    console.error("Ошибка при обновлении записи в базе данных:", error);
  }
}