import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { getUserById, updateUser } from './user.service';
import { updateUserSchema } from './user.schema';

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await getUserById(req.userId!);
        if(!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = updateUserSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
            return;
        }

        const user = await updateUser(req.userId!, parsed.data);
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
}