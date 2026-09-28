import api from './client';
import type { Post } from '../types';

export const getPosts = async (type?: string) => {
    const response = await api.get<Post[]>('/posts', { params: { type } });
    return response.data;
}

export const createPost = async (data: {
    type: string;
    subject: string;
    description: string;
    tags?: string[];
}) => {
    const response = await api.post<Post>('/posts', data);
    return response.data;
};

export const deletePost = async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};