import api from './client';
import type { ProfileSummary, User } from '../types';

export const getMyProfile = async () => {
    const response = await api.get<{ user: User; summary: ProfileSummary }>('/users/profile');
    return response.data;
}

export const getProfileById = async (userId: string) => {
    const response = await api.get<{ user: User; summary: ProfileSummary }>(`/users/${userId}/profile`);
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