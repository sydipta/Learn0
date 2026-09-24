import prisma from './../../db/prisma';

export const createReview = async (reviewerId: string, data:{
    connectionId: string;
    revieweeId: string;
    rating: number;
    comment: string;
}) => {
    //Only allow if connection is accepted
    const connection = await prisma.connection.findUnique({
        where: {id: data.connectionId},
    });

    if(!connection || connection.status !== 'accepted') {
        throw new Error('Connection must be accepted before leaving a review');
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