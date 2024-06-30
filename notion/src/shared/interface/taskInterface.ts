export interface taskItem {
    title: string;
    deadline: string;
    tags: string[];
    status: string;
}

export interface userItem {
    name: string;
    email: string;
    id: number;
    skills: string[];
    softwares: string[];
    renders: string[];
}

export interface meetItem {
    name: string;
    date: string;
    users: string[];
}
