import api from './client';
import type { User } from '../types';

export const signup = async (data: {
    email: string;
    name: string;
    password: string;
    program: string;
    branch: string;
    year: number;
    avatarUrl: string;
}) => {
    const response = await api.post<{ message: string; user: User}>(`/auth/signup`, data);
    return response.data;
};

export const login = async (data: {email: string; password: string}) => {
    const response = await api.post<{ token: string; user: User}>('/auth/login', data);
    return response.data;
};

export const sendOtp = async (email: string) => {
     const response = await api.post<{ message: string }>('/auth/send-otp', { email });
     return response.data;
};

export const verifyOtp = async (data: { email: string; code: string }) => {
     const response = await api.post<{ message: string }>('/auth/verify-otp', data);
     return response.data;
};