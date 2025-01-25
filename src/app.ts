import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { responseMessage } from './constants/responseMessage';
import httpError from './utils/httpError';
import captionsRouter from './router/router';

dotenv.config();

const app: Application = express();

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', 'public')));

app.use('/api/v1/captions', captionsRouter);
app.use('/', (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to Youtube Transcript Service'
    });
});

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'));
    } catch (error) {
        httpError(next, error, req, 404);
    }
});

export default app;

