import express from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import postRouter from './modules/post/post.router';
import connectionRouter from './modules/connectoin/connection.router';
import reviewRouter from './modules/review/review.router';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/reviews', reviewRouter);
export default app;