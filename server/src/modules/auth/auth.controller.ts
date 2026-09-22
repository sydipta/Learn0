import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from './auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, name, password, program, branch, year, avatarUrl } = req.body;
    const user = await createUser({
      email,
      name,
      password,
      program,
      branch,
      year,
      avatarUrl
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'User created', user: userWithoutPassword });
  }
  catch (error) {
    res.status(500).json({ error: "Something went wrong" });
    }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

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
