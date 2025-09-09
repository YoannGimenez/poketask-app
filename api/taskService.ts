import api from './api';

const taskService = {
    getMyTasks: async () => {
        try {
            const res = await api.get('/task/my-tasks');
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la récupération des tâches',
                    code: 'FETCH_TASKS_ERROR'
                }
            };
        }
    },

    createTask: async (taskData: any) => {
        try {
            const res = await api.post('/task', taskData);
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la création de la tâche',
                    code: 'CREATE_TASK_ERROR'
                }
            };
        }
    },

    updateTask: async (taskId: string, taskData: any) => {
        try {
            const res = await api.patch(`/task/${taskId}/edit`, taskData);
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la modification de la tâche',
                    code: 'UPDATE_TASK_ERROR'
                }
            };
        }
    },

    completeTask: async (taskId: string) => {
        try {
            const res = await api.patch(`/task/${taskId}/complete`);
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la validation de la tâche',
                    code: 'COMPLETE_TASK_ERROR'
                }
            };
        }
    },

    deleteTask: async (taskId: string) => {
        try {
            const res = await api.delete(`/task/${taskId}/delete`);
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la suppression de la tâche',
                    code: 'DELETE_TASK_ERROR'
                }
            };
        }
    },
};

export default taskService;