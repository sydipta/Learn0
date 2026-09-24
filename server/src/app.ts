import express from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import postRouter from './modules/post/post.router';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);

export default app;