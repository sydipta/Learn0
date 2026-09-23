import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith( 'Bearer ' )){
        res.status(401).json({message: 'No token provided'});
        return;
    }

    const token = authHeader.slice(7);

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as{userId: string};
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({message: 'Invalid token'});
    }
}