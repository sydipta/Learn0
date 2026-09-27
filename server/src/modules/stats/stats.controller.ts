import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import prisma from '../../db/prisma';

export const getStats = async (req: AuthRequest, res: Response) => {
    try{
        const [users, posts, connections, myRating] = await Promise.all([
            prisma.user.count(),
            prisma.post.count({where: { status: 'active' } }),
            prisma.connection.count({where: { status: 'accepted' } }),
            prisma.review.aggregate({
                where: {revieweeId: req.userId },
                _avg: { rating: true },
            }),
        ]);

        res.status(200).json({
            totalStudents: users,
            activePosts: posts,
            connectionsMade: connections,
            yourRating: myRating._avg.rating ? Number(myRating._avg.rating.toFixed(1)) : 0,
        })
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};