import api from './client';

export interface Stats {
    totalStudents: number;
    activePosts: number;
    completedSessions: number;
    connectionsMade: number;
}

export const getStats = async () => {
    const response = await api.get<Stats>('/stats');
    return response.data;
}