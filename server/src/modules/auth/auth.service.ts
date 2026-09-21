import prisma from '../../db/prisma';
import bcrypt from 'bcrypt'

export const createUser = async (data: {
    email: string;
    name: string;
    password: string;
    program: string;
    branch: string;
    year: number;
    avatarUrl: string;
}) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({ 
        data: {
            ...data,
            password: hashedPassword,
        }
     });
    return user;
}