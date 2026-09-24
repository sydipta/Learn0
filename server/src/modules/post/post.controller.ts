import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { createPost, getPosts, deletePost } from './post.service';
import { createPostSchema } from './post.schema'

export const createPostHandler = async (req: AuthRequest, res: Response) => {
    try{
        const parsed = createPostSchema.safeParse(req.body);

        if(!parsed.success){
            res.status(400).json({message: 'Invalid input', errors: parsed.error.issues});
            return;
        }

        const post = await createPost(req.userId!, parsed.data);
        res.status(201).json(post);       
    } catch (error) {
        res.status(500).json({message: 'Something went wrong' });
    }
};

export const getPostHandler = async (req: AuthRequest, res: Response) => {
    try{
        const type = req.query.type as string | undefined;
        const posts = await getPosts(type);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({message: 'Something went wrong' });
    }
};

export const deletePostHandler = async (req: AuthRequest, res: Response) => {
    try{
        await deletePost(req.params.id as string, req.userId!);
        res.status(200).json({message: 'Post deleted Successfully'});
    } catch (error) {
        res.status(500).json({message: 'Something went wrong' });
    }
};