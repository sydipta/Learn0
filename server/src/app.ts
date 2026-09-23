import express from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
export default app;