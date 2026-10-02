import prisma from './../../db/prisma';

export const createReview = async (reviewerId: string, data:{
    connectionId: string;
    revieweeId: string;
    rating: number;
    comment: string;
}) => {
    //Only allow if connection is accepted
    const connection = await prisma.connection.findUnique({
        where: { id: data.connectionId },
    });

    if(!connection || connection.status !== 'accepted') {
        throw new Error('Connection must be accepted before leaving a review');
    }

    if (reviewerId !== connection.requesterId && reviewerId !== connection.receiverId) {
        throw new Error('You must be part of the connection to leave a review');
    }

    const expectedRevieweeId = reviewerId === connection.requesterId
        ? connection.receiverId
        : connection.requesterId;

    if (data.revieweeId !== expectedRevieweeId) {
        throw new Error('You can only review the other participant');
    }

    const session = await prisma.session.findUnique({
        where: { connectionId: data.connectionId },
    });

    if (!session || session.status !== 'completed') {
        throw new Error('Session must be completed before leaving a review');
    }

    const existingReview = await prisma.review.findFirst({
        where: {
            connectionId: data.connectionId,
            reviewerId,
        },
    });

    if (existingReview) {
        throw new Error('You have already reviewed this session');
    }

    return await prisma.review.create({
        data: {
            ...data,
            reviewerId,
        },
    });
};

export const getReviewsForUser = async (userId: string) => {
    return await prisma.review.findMany({
        where: { revieweeId: userId },
        include: {
            reviewer: {
                select: { id: true, name: true, avatarUrl: true },
            },
        },
        orderBy: {createdAt: 'desc' },
    });
};