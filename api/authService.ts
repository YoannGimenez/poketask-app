import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
    login: async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur de connexion',
                    code: 'CONNECTION_ERROR'
                }
            };
        }
    },

    register: async (username: string, email: string, password: string) => {
        try {
            const res = await api.post('/auth/register', { username, email, password });
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de l\'inscription',
                    code: 'REGISTRATION_ERROR'
                }
            };
        }
    },

    checkAuth: async () => {
        const res = await api.get('/auth/verify');
        return res.data;
    },

    logout: async () => {
        await AsyncStorage.removeItem('authToken');
    },
};

export default authService;