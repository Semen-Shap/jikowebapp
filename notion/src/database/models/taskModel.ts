import { taskItem } from "../../shared/interface/taskInterface";


export function TaskModel({ title, deadline, tags, status }: taskItem) {
  const properties = {
    Name: {
      title: [
        {
          text: {
            content: title,
          },
        },
      ],
    },
    Deadline: {
      deadline: [
        {
          text: {
            content: deadline,
          },
        },
      ],
    },
    Tags: {
      select: {
        name: tags,
      },
    },
    Status: {
      status: {
        name: status,
      },
    },
  };

  return properties;
}
