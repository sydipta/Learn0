import api from './client';
import type { User } from '../types';

export const getMyProfile = async () => {
    const response = await api.get<User>('/users/me');
    return response.data;
}

export const updateMyProfile = async (data: Partial<{
    name: string;
    program: string;
    branch: string;
    year: number;
    avatarUrl: string;
}>) => {
    const response = await api.patch<User>('/users/me', data);
    return response.data;
};