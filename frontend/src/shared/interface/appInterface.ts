export interface TaskItem {
    id: number;
    title: string;
    completed?: boolean;
    deadline: string;
    tags: string[];
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface UserItem {
    id: string;
    name: string;
    email: string;
    skills: string[];
    softwares: string[];
    renders: string[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface MeetItem {
    id?: number;
    name: string;
    completed?: boolean;
    date: string;
    users: string[];
    createdAt?: Date;
    updatedAt?: Date;
    
}