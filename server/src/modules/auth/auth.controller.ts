import { Request, Response } from "express";
import { createUser } from "./auth.service";

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