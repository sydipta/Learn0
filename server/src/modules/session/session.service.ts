import prisma from '../../db/prisma';

export const createSession = async (data: {
  connectionId: string;
  scheduledAt: string;
}) => {
  // Only allow session if connection is accepted
  const connection = await prisma.connection.findUnique({
    where: { id: data.connectionId },
  });

  if (!connection || connection.status !== 'accepted') {
    throw new Error('Connection must be accepted before scheduling a session');
  }

  return await prisma.session.upsert({
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
          requester: { select: { id: true, name: true, avatarUrl: true } },
          receiver: { select: { id: true, name: true, avatarUrl: true } },
          post: { select: { id: true, subject: true } },
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
  });

  if (!session) {
    throw new Error('Session not found');
  }

  return await prisma.session.update({
    where: { id: sessionId },
    data: { status },
  });
};