import prisma from '../../db/prisma';
import { createNotificationIfMissing } from '../notification/notification.service';

export const createSession = async (data: {
  connectionId: string;
  scheduledAt: string;
}) => {
  // Only allow session if connection is accepted
  const connection = await prisma.connection.findUnique({
    where: { id: data.connectionId },
    include: {
      requester: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
      post: { select: { subject: true } },
    },
  });

  if (!connection || connection.status !== 'accepted') {
    throw new Error('Connection must be accepted before scheduling a session');
  }

  const session = await prisma.session.upsert({
    where: { connectionId: data.connectionId },
    update: {
      scheduledAt: new Date(data.scheduledAt),
      status: 'upcoming',
    },
    create: {
      connectionId: data.connectionId,
      scheduledAt: new Date(data.scheduledAt),
    },
  });

  const scheduledAt = new Date(data.scheduledAt).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const message = `Session for ${connection.post.subject} with ${connection.requester.name} is scheduled for ${scheduledAt}.`;

  await Promise.all([
    createNotificationIfMissing({ userId: connection.requester.id, type: 'session_scheduled', message }),
    createNotificationIfMissing({ userId: connection.receiver.id, type: 'session_scheduled', message }),
  ]);

  return session;
};

export const getUpcomingSessions = async (userId: string) => {
  return await prisma.session.findMany({
    where: {
      status: { in: ['upcoming', 'Upcoming'] },
      scheduledAt: { gte: new Date() },
      connection: {
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
    },
    include: {
      connection: {
        include: {
          requester: { select: { id: true, name: true, email: true, avatarUrl: true } },
          receiver: { select: { id: true, name: true, email: true, avatarUrl: true } },
          post: { select: { id: true, subject: true, type: true } },
        },
      },
    },
    orderBy: { scheduledAt: 'asc' },
  });
};

export const updateSessionStatus = async (sessionId: string, userId: string, status: string) => {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      connection: {
        OR: [
          { requesterId: userId },
          { receiverId: userId },
        ],
      },
    },
    include: {
      connection: {
        include: {
          requester: { select: { id: true, name: true } },
          receiver: { select: { id: true, name: true } },
          post: { select: { subject: true } },
        },
      },
    },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  const updatedSession = await prisma.session.update({
    where: { id: sessionId },
    data: { status },
  });

  const otherUser = session.connection.requesterId === userId
    ? session.connection.receiver
    : session.connection.requester;
  const statusLabel = status === 'completed' ? 'completed' : 'marked as did not happen';

  const notification = {
    type: status === 'completed' ? 'session_completed' : 'session_did_not_happen',
    message: `Your session for ${session.connection.post.subject} was ${statusLabel}.`,
  };

  await Promise.all([
    createNotificationIfMissing({ userId, ...notification }),
    createNotificationIfMissing({ userId: otherUser.id, ...notification }),
  ]);

  return updatedSession;
};