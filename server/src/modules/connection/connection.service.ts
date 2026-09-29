import prisma from '../../db/prisma';

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

  return await prisma.connection.create({
    data: {
      requesterId,
      ...data,
    },
  });
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
        select: { id: true, name: true, avatarUrl: true, program: true, branch: true, year: true },
      },
      receiver: {
        select: { id: true, name: true, avatarUrl: true, program: true, branch: true, year: true },
      },
      post: {
        select: { id: true, type: true, subject: true },
      },
      session: {
        select: { id: true, scheduledAt: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateConnectionStatus = async (id: string, userId: string, status: string) => {
  return await prisma.connection.update({
    where: { id, receiverId: userId },
    data: { status },
  });
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