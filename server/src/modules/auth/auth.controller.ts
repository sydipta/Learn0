import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from './auth.service';
import {signupSchema, loginSchema} from './auth.schema';

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }

    const user = await createUser(parsed.data);

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'User created', user: userWithoutPassword });
  }
  catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if(!parsed.success){
      res.status(400).json({message: 'Invalid input', errors: parsed.error.issues});
      return;
    }

    const user = await loginUser(parsed.data.email, parsed.data.password);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({token, user: userWithoutPassword});
  } catch (error: any) { 
    res.status(401).json({ message: error.message});
  }
};
