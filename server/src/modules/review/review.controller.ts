import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createReview, getReviewsForUser } from './review.service';
import { createReviewSchema } from './review.schema';

export const createReviewHandler = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = createReviewSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
            return;
        }

        const review = await createReview(req.userId!, parsed.data);
        res.status(201).json(review);
    } catch (error: any) {
        res.status(400).json({ message: error.message || 'Something went wrong' });
    }
};

export const getReviewsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const reviews = await getReviewsForUser(req.params.userId as string);
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};