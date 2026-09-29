import api from './client';

export interface Session {
  id: string;
  connectionId: string;
  scheduledAt: string;
  status: string;
  connection: {
    requester: { id: string; name: string; avatarUrl: string };
    receiver: { id: string; name: string; avatarUrl: string };
    post: { id: string; subject: string };
  };
}

export const createSession = async (data: {
  connectionId: string;
  scheduledAt: string;
}) => {
  const response = await api.post<Session>('/sessions', data);
  return response.data;
};

export const getUpcomingSessions = async () => {
  const response = await api.get<Session[]>('/sessions/upcoming');
  return response.data;
};

export const updateSessionStatus = async (sessionId: string, status: 'completed' | 'did_not_happen') => {
  const response = await api.patch<Session>(`/sessions/${sessionId}/status`, { status });
  return response.data;
};