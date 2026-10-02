import prisma from '../../db/prisma';
import bcrypt from 'bcrypt'

export const createUser = async (data: {
    email: string;
    name: string;
    password: string;
    program: string;
    branch: string;
    year: number;
    avatarUrl?: string;
}) => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const avatarUrl = data.avatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + data.name;
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser?.isVerified) {
        const error = new Error('An account with this email already exists') as Error & { statusCode: number };
        error.statusCode = 409;
        throw error;
    }

    const user = existingUser
        ? await prisma.user.update({
            where: { id: existingUser.id },
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                program: data.program,
                branch: data.branch,
                year: data.year,
                avatarUrl,
                isVerified: false,
            },
        })
        : await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
                avatarUrl,
            },
        });
    return user;
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },        
    });
    if(!user) {
        throw new Error('Invalid Credentials');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) {
        throw new Error('Invalid Credentials');
    }
        if(!user.isVerified) {
            throw new Error('Please verify your email before logging in');
        }
    return user;
}