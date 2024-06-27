export interface TaskItem {
    id: number;
    name: string;
    completed?: boolean;
    deadline: string;
    tags: string[];
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface UserItem {
    id: number;
    name: string;
    email: string;
    skills: string[];
    softwares: string[];
    renders: string[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface User {
    id: number;
    name: string;
    email: string;
    skills: string;
    softwares: string;
    renders: string;
    createdAt: string;
    updatedAt: string;
};