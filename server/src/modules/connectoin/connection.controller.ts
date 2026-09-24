import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createConnection, getMyConnections, updateConnectionStatus } from './connection.service';
import { createConnectionSchema, updateConnectionSchema } from './connection.schema';

export const createConnectionHandler = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = createConnectionSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json( {message: 'Invalid input', errors: parsed.error.issues });
            return;
        }

        const connection = await createConnection(req.userId!, parsed.data);
        res.status(201).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const getMyConnectionsHandler = async (req: AuthRequest, res: Response) => {
    try {
        const connections = await getMyConnections(req.userId!);
        res.status(200).json(connections);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const updateConnectionHandler = async (req: AuthRequest, res: Response) => {
    try {
        const parsed = updateConnectionSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
            return;
        }

        const connection = await updateConnectionStatus(req.params.id as string, req.userId!, parsed.data.status);
        res.status(200).json(connection);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};