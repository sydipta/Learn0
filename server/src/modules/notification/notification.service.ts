import prisma from '../../db/prisma';

export const createNotificationIfMissing = async (data: {
  userId: string;
  type: string;
  message: string;
}) => {
  const existing = await prisma.notification.findFirst({
    where: data,
  });

  if (existing) return existing;

  return prisma.notification.create({ data });
};

const ensureUpcomingSessionReminders = async (userId: string) => {
  const now = new Date();
  const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const sessions = await prisma.session.findMany({
    where: {
      status: { in: ['upcoming', 'Upcoming'] },
      scheduledAt: { gte: now, lte: twoHoursFromNow },
      connection: {
        OR: [{ requesterId: userId }, { receiverId: userId }],
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

  await Promise.all(sessions.map(session => {
    const other = session.connection.requesterId === userId
      ? session.connection.receiver
      : session.connection.requester;

    return createNotificationIfMissing({
      userId,
      type: 'session_reminder',
      message: `Session with ${other.name} for ${session.connection.post.subject} starts within 2 hours.`,
    });
  }));
};

export const getNotifications = async (userId: string) => {
  await ensureUpcomingSessionReminders(userId);

  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markNotificationRead = async (notificationId: string, userId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const markAllNotificationsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};
