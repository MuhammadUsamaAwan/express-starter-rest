import 'express-async-errors';
import { config } from 'dotenv';
config();

import express, { type Request, type Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import errorHandler from '@/middleware/errorHandler';
import corsOptions from '@/config/corsOptions';
import env from '@/config/env';
import controller from '@/controller';

const { PORT } = env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(compression());

app.use('/api', controller);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({ message: '404 - No Route Found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server Started on Port ${PORT}`));
