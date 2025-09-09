import { TaskDifficulty } from '@/models/enums/TaskDifficulty';
import { TaskStatus } from '@/models/enums/TaskStatus';
import { TaskType } from '@/models/enums/TaskType';
import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string()
        .trim()
        .min(1, "Le nom d'utilisateur est requis")
        .min(2, 'Le nom d\'utilisateur doit contenir au moins 2 caractères')
        .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
        .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string()
        .trim()
        .min(1, "L'email est requis")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format d'email invalide"),
    password: z.string()
        .min(1, "Le mot de passe est requis")
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
    confirmPassword: z.string()
        .min(1, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.email('Format d\'email invalide'),
    password: z.string()
        .min(1, 'Le mot de passe est requis')
});

export const dateSchema = z.preprocess(
    (arg) => (typeof arg === "string" ? new Date(arg) : arg),
    z.date().nullable()
);

export const createTaskSchema = z.object({
    title: z.string()
        .min(1, 'Le titre est requis')
        .max(50, 'Le titre ne peut pas dépasser 50 caractères'),
    
    description: z.string()
        .min(1, 'La description est requise')
        .max(100, 'La description ne peut pas dépasser 100 caractères'),
    
    status: z.enum([TaskStatus.PENDING, TaskStatus.COMPLETED, TaskStatus.TRUE_COMPLETED, TaskStatus.DELETED, TaskStatus.EXPIRED]).default(TaskStatus.PENDING),
    type: z.enum([TaskType.DAILY, TaskType.WEEKLY, TaskType.ONE_TIME, TaskType.REPEATABLE]).default(TaskType.DAILY),
    difficulty: z.enum([TaskDifficulty.EASY, TaskDifficulty.NORMAL, TaskDifficulty.HARD]).default(TaskDifficulty.NORMAL),
    timezone: z.string().default('UTC'),
    dateStart: dateSchema,
    dateEnd: dateSchema
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(['PENDING', 'COMPLETED', 'TRUE_COMPLETED', 'DELETED', 'EXPIRED']),
    type: z.enum(['DAILY', 'WEEKLY', 'ONE_TIME', 'REPEATABLE']),
    difficulty: z.enum(['EASY', 'NORMAL', 'HARD']),
    timezone: z.string(),
    dateStart: z.string().nullable(),
    dateEnd: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    userId: z.string()
});

export const tasksResponseSchema = z.array(taskResponseSchema);

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type CreateTaskData = z.infer<typeof createTaskSchema>;
export type UpdateTaskData = z.infer<typeof updateTaskSchema>;