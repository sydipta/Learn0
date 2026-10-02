import prisma from "../../db/prisma";

export const getUserProfile = async (id: string) => {
    const [user, connections, reviewSummary] = await Promise.all([
        prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                program: true,
                branch: true,
                year: true,
                avatarUrl: true,
                status: true,
                createdAt: true,
            },
        }),
        prisma.connection.findMany({
            where: {
                status: 'accepted',
                OR: [{ requesterId: id }, { receiverId: id }],
            },
            include: {
                session: { select: { status: true } },
                post: { select: { userId: true, type: true } },
            },
        }),
        prisma.review.aggregate({
            where: { revieweeId: id },
            _avg: { rating: true },
            _count: { id: true },
        }),
    ]);

    if (!user) return null;

    let lessonsTaught = 0;
    let lessonsLearned = 0;

    connections
        .filter(connection => connection.session?.status === 'completed')
        .forEach(connection => {
            const isPostOwner = connection.post.userId === id;
            const isLearningRequest = connection.post.type === 'learning_request';
            const userTaught = isLearningRequest ? !isPostOwner : isPostOwner;

            if (userTaught) lessonsTaught += 1;
            else lessonsLearned += 1;
        });

    return {
        user,
        summary: {
            acceptedConnections: connections.length,
            lessonsTaught,
            lessonsLearned,
            averageRating: reviewSummary._avg.rating
                ? Number(reviewSummary._avg.rating.toFixed(1))
                : 0,
            reviewCount: reviewSummary._count.id,
        },
    };
};

export const updateUser = async (id: string, data:{
    program?: string;
    branch?: string;
    year?: number;
}) => {
    const user = await prisma.user.update({
        where: { id },
        data,
    });
    return user;
}