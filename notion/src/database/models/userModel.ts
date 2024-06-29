import { userItem } from "../../shared/interface/taskInterface";

export function UserModel({ name, email, id, skills, softwares, renders }: userItem) {
  const properties = {
    Name: {
      title: [
        {
          text: {
            content: name,
          },
        },
      ],
    },
    Email: {
      email: email,
    },
    TelegramId: {
      number : id,
    },
    Skills: {
      multi_select: skills.map((skill: string) => ({name: skill})),
    },
    Softwares: {
      multi_select: softwares.map((software: string) => ({name: software})),
    },
    Renders: {
      multi_select: renders.map((render: string) => ({name: render})),
    },
  };

  return properties;
}
