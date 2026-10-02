import { Prisma } from '@prisma/client';
import prisma from '../../db/prisma';

export const createPost = async (userId: string, data: {
  type: string;
  subject: string;
  description: string;
  tags?: string[];
}) => {
  return await prisma.post.create({
    data: {
      ...data,
      userId,
      tags: data.tags || [],
    },
  });
};

export const getPosts = async (type?: string, includeCompleted = false, search?: string) => {
  const normalizedSearch = search?.trim();
  let matchingPostIds: string[] | undefined;

  if (normalizedSearch) {
    const matchingPosts = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id"
      FROM "Post"
      WHERE "subject" ILIKE ${`%${normalizedSearch}%`}
         OR "description" ILIKE ${`%${normalizedSearch}%`}
         OR EXISTS (
           SELECT 1
           FROM unnest("tags") AS tag
           WHERE tag ILIKE ${`%${normalizedSearch}%`}
         )
    `);
    matchingPostIds = matchingPosts.map(post => post.id);
  }

  return await prisma.post.findMany({
    where: {
      status: 'active',
      ...(matchingPostIds && { id: { in: matchingPostIds } }),
      ...(!includeCompleted && {
        connections: {
          none: {
            session: {
              status: 'completed',
            },
          },
        },
      }),
      ...(type && { type }),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          program: true,
          branch: true,
          year: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const deletePost = async (id: string, userId: string) => {
  const post = await prisma.post.findFirst({
    where: { id, userId },
    select: { id: true },
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const connections = await prisma.connection.findMany({
    where: { postId: id },
    select: {
      id: true,
      status: true,
      session: { select: { status: true } },
    },
  });

  const hasActiveConnection = connections.some(connection =>
    connection.status === 'pending' ||
    (connection.status === 'accepted' && connection.session?.status !== 'did_not_happen')
  );

  if (hasActiveConnection) {
    throw new Error('Cannot delete a post with pending or active connections');
  }

  const connectionIds = connections.map(connection => connection.id);

  return await prisma.$transaction(async transaction => {
    if (connectionIds.length > 0) {
      await transaction.review.deleteMany({ where: { connectionId: { in: connectionIds } } });
      await transaction.session.deleteMany({ where: { connectionId: { in: connectionIds } } });
      await transaction.connection.deleteMany({ where: { id: { in: connectionIds } } });
    }

    return transaction.post.delete({ where: { id: post.id } });
  });
};