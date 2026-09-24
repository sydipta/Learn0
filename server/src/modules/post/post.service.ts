import prisma from '../../db/prisma';

export const createPost = async (userId: string, data:{
    type: string;
    subject: string;
    description: string;
}) => {
    return await prisma.post.create({
        data: {
            ...data,
            userId
        },
    });
};

export const getPosts = async(type?: string) => {
    return await prisma.post.findMany({
        where: {
            status: 'active',
            ...(type && {type}),
        },
        include: {
            user: {
                select:{
                    id: true,
                    name: true,
                    program: true,
                    branch: true,
                    year: true,
                    avatarUrl: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const deletePost = async (id: string, userId: string) => {
    return await prisma.post.delete({
        where: {id, userId},
    });
};