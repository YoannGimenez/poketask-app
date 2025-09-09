import {UserRole} from "@/models/enums/UserRole";

export interface User {
    id: string;
    email: string;
    username: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: UserRole;
    experience: number;
    level: number;
    nextLevelExperience: number;
    money: number;
    completedTasksCount: number;
    pokemonsCount: number;
}