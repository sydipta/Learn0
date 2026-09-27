import api from './client';

export interface Stats {
    totalStudents: number;
    activePosts: number;
    connectionsMade: number;
    yourRating: number;
}

export const getStats = async () => {
    const response = await api.get<Stats>('/stats');
    return response.data;
}