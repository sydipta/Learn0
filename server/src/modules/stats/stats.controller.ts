import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import prisma from '../../db/prisma';

export const getStats = async (req: AuthRequest, res: Response) => {
    try{
        const [users, posts, completedSessions, acceptedConnections] = await Promise.all([
            prisma.user.count(),
            prisma.post.count({
                where: {
                    status: 'active',
                    connections: {
                        none: {
                            session: { status: 'completed' },
                        },
                    },
                },
            }),
            prisma.session.count({ where: { status: 'completed' } }),
            prisma.connection.findMany({
                where: { status: 'accepted' },
                select: { session: { select: { status: true } } },
            }),
        ]);

        const connectionsMade = acceptedConnections.filter(connection =>
            connection.session?.status?.toLowerCase() !== 'did_not_happen'
        ).length;

        res.status(200).json({
            totalStudents: users,
            activePosts: posts,
            completedSessions,
            connectionsMade,
        })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};