import api from './client';
import type { Connection } from '../types';

export const createConnection = async (data: {
    postId: string;
    receiverId: string;
}) => {
    const response = await api.post<Connection>('/connections', data);
    return response.data;
}

export const getMyConnections = async () => {
    const response = await api.get<Connection[]>('/connections/me');
    return response.data;
}

export const updateConnection = async (id: string, status: 'accepted' | 'rejected') => {
    const response = await api.patch<Connection>(`/connections/${id}`, { status });
    return response.data;
};

export const deleteConnection = async (id: string) => {
    const response = await api.delete<Connection>(`/connections/${id}`);
    return response.data;
};