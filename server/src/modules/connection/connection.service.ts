import prisma from '../../db/prisma';
import { createNotificationIfMissing } from '../notification/notification.service';

export const createConnection = async (requesterId: string, data: {
  postId: string;
  receiverId: string;
}) => {
  if (requesterId === data.receiverId) {
    throw new Error('You cannot connect with yourself');
  }

  const existing = await prisma.connection.findFirst({
    where: {
      requesterId,
      postId: data.postId,
    },
  });

  if (existing) {
    throw new Error('You have already sent a request for this post');
  }

  const connection = await prisma.connection.create({
    data: {
      requesterId,
      ...data,
    },
  });

  const [requester, post] = await Promise.all([
    prisma.user.findUnique({ where: { id: requesterId }, select: { name: true } }),
    prisma.post.findUnique({ where: { id: data.postId }, select: { subject: true } }),
  ]);

  if (requester && post) {
    await createNotificationIfMissing({
      userId: data.receiverId,
      type: 'connection_request',
      message: `${requester.name} sent you a connection request for ${post.subject}.`,
    });
  }

  return connection;
};

export const getMyConnections = async (userId: string) => {
  return await prisma.connection.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      requester: {
        select: { id: true, name: true, email: true, avatarUrl: true, program: true, branch: true, year: true },
      },
      receiver: {
        select: { id: true, name: true, email: true, avatarUrl: true, program: true, branch: true, year: true },
      },
      post: {
        select: { id: true, type: true, subject: true },
      },
      session: {
        select: { id: true, scheduledAt: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  }).then(connections => connections.map(connection => {
    if (connection.status === 'accepted') return connection;

    const { email: _requesterEmail, ...requester } = connection.requester;
    const { email: _receiverEmail, ...receiver } = connection.receiver;
    return { ...connection, requester, receiver };
  }));
};

export const updateConnectionStatus = async (id: string, userId: string, status: string) => {
  const connection = await prisma.connection.findFirst({
    where: { id, receiverId: userId },
    include: {
      requester: { select: { name: true } },
      post: { select: { subject: true } },
    },
  });

  if (!connection) throw new Error('Connection not found');

  const updatedConnection = await prisma.connection.update({
    where: { id, receiverId: userId },
    data: { status },
  });

  const action = status === 'accepted' ? 'accepted' : 'rejected';
  await createNotificationIfMissing({
    userId: connection.requesterId,
    type: `connection_${action}`,
    message: `${connection.requester.name}, your request for ${connection.post.subject} was ${action}.`,
  });

  return updatedConnection;
};

export const deleteConnection = async (id: string, userId: string) => {
  const connection = await prisma.connection.findFirst({
    where: {
      id,
      OR: [
        { requesterId: userId },
        { receiverId: userId },
      ],
    },
    include: { session: true },
  });

  if (!connection) {
    throw new Error('Connection not found');
  }

  if (connection.session?.status !== 'did_not_happen') {
    throw new Error('Only sessions marked as did not happen can be removed');
  }

  return await prisma.$transaction(async (transaction) => {
    if (connection.session) {
      await transaction.session.delete({ where: { id: connection.session.id } });
    }

    return transaction.connection.delete({ where: { id } });
  });
};