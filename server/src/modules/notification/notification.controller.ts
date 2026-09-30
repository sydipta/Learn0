import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notification.service';

export const getNotificationsHandler = async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await getNotifications(req.userId!);
    res.status(200).json(notifications);
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const markNotificationReadHandler = async (req: AuthRequest, res: Response) => {
  try {
    await markNotificationRead(req.params.id as string, req.userId!);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const markAllNotificationsReadHandler = async (req: AuthRequest, res: Response) => {
  try {
    await markAllNotificationsRead(req.userId!);
    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
