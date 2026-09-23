import prisma from "../../db/prisma";

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });
    return user;
};

export const updateUser = async (id: string, data:{
    name?: string;
    program?: string;
    branch?: string;
    year?: number;
    avatarUrl?: string;
}) => {
    const user = await prisma.user.update({
        where: { id },
        data,
    });
    return user;
}
