import {TaskType} from "@/models/enums/TaskType";
import {TaskDifficulty} from "@/models/enums/TaskDifficulty";
import {TaskStatus} from "@/models/enums/TaskStatus";

export interface Task {
    id: string;
    title: string;
    description: string;
    difficulty: TaskDifficulty;
    type: TaskType;
    status: TaskStatus;
    createdAt: Date;
    expiresAt?: Date;
    dateStart?: Date | null;
    dateEnd?: Date | null;
    timezone: string;
}