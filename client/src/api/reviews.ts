import api from './client';
import type { Review } from '../types';

export const createReview = async (data: {
    connectionId: string;
    revieweeId: string;
    rating: number;
    comment: string;
}) => {
    const response = await api.post<Review>('/reviews', data);
    return response.data;
};

export const getReviews = async (userId: string) => {
    const response = await api.get<Review[]>(`/reviews/${userId}`);
    return response.data;
};