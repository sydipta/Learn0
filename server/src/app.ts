import express from 'express';
import cors from 'cors';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import postRouter from './modules/post/post.router';
import connectionRouter from './modules/connection/connection.router';
import reviewRouter from './modules/review/review.router';
import statsRouter from './modules/stats/stats.router';
import sessionRouter from './modules/session/session.router';
import notificationRouter from './modules/notification/notification.router';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/connections', connectionRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/stats', statsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/api/notifications', notificationRouter);

export default app;