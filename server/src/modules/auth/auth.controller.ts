import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from './auth.service';
import { signupSchema, loginSchema, sendOtpSchema, verifyOtpSchema } from './auth.schema';
import { sendOtp, verifyOtp } from './otp.service';

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
  catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'An account with this email already exists' });
      return;
    }

    res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : 'Something went wrong',
    });
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
      { userId: user.id, tokenVersion: user.passwordVersion },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({token, user: userWithoutPassword});
  } catch (error: any) { 
    res.status(401).json({ message: error.message});
  }
};

export const sendOtpHandler = async (req: Request, res: Response) => {
  try {
    const parsed = sendOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }

    await sendOtp(parsed.data.email);
    res.status(200).json({ message: 'Verification code sent' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyOtpHandler = async (req: Request, res: Response) => {
  try {
    const parsed = verifyOtpSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: 'Invalid input', errors: parsed.error.issues });
      return;
    }

    await verifyOtp(parsed.data.email, parsed.data.code);
    res.status(200).json({ message: 'Email verified' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
