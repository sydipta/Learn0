import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createSession, getUpcomingSessions, updateSessionStatus } from './session.service';
import { createSessionSchema, updateSessionStatusSchema } from './session.schema';

export const createSessionHandler = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createSessionSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }

    const session = await createSession(parsed.data);
    res.status(201).json(session);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUpcomingSessionsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await getUpcomingSessions(req.userId!);
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateSessionStatusHandler = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = updateSessionStatusSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }

    const session = await updateSessionStatus(req.params.id as string, req.userId!, parsed.data.status);
    res.status(200).json(session);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};