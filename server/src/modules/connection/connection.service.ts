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
      }
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