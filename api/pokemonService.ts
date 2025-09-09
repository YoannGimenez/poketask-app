import api from './api';

const pokemonService = {
    getStarters: async () => {
        try {
            const res = await api.get('/pokemon/starters');
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la récupération des starters',
                    code: 'FETCH_STARTERS_ERROR'
                }
            };
        }
    },

    addStarter: async (pokemonId: number) => {
        try {
            const res = await api.post('/pokemon/add-starter', { pokemonId });
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de l\'ajout du starter',
                    code: 'ADD_STARTER_ERROR'
                }
            };
        }
    },

    getMyPokemons: async () => {
        try {
            const res = await api.get('/pokemon/my-pokemons');
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la récupération des Pokémon',
                    code: 'FETCH_POKEMONS_ERROR'
                }
            };
        }
    },

    // Capturer un Pokémon
    catchPokemon: async (pokemonId: number, locationId: string, itemId: string, isShiny: boolean) => {
        try {
            const res = await api.post(`/pokemon/${pokemonId}/catch`, {
                locationId,
                itemId,
                isShiny
            });
            return { success: true, data: res.data };
        } catch (error: any) {
            if (error.response?.data?.success === false) {
                return { success: false, error: error.response.data.error };
            }
            return {
                success: false,
                error: {
                    message: 'Erreur lors de la capture du Pokémon',
                    code: 'CATCH_POKEMON_ERROR'
                }
            };
        }
    }
};

export default pokemonService;