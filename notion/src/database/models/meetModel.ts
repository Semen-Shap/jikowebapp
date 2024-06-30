import { meetItem } from "../../shared/interface/taskInterface";


export function TaskModel({ name, date, users }: meetItem) {
  const properties = {
    Name: {
      rich_text: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
    Date: {
      date: date
    },
    Users: {
      relation: users
    },
  };

  return properties;
}
