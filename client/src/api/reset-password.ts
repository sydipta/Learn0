import api from './client';

export const sendResetPasswordCode = async () => {
  const response = await api.post<{ message: string }>('/reset-password/send-code');
  return response.data;
};

export const resetPassword = async (data: { code: string; newPassword: string }) => {
  const response = await api.post<{ message: string }>('/reset-password', data);
  return response.data;
};

export const sendForgotPasswordCode = async (email: string) => {
  const response = await api.post<{ message: string; ticket: string }>('/reset-password/forgot/send-code', { email });
  return response.data;
};

export const forgotPassword = async (ticket: string, data: { code: string; newPassword: string }) => {
  const response = await api.post<{ message: string }>('/reset-password/forgot', data, {
    headers: { 'X-Reset-Password-Ticket': ticket },
  });
  return response.data;
};
