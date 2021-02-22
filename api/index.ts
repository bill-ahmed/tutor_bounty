require('dotenv').config()

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from './Logger';

const app = express();

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3000;

/** Helpers **/
const isDevEnv = () => { return process.env.NODE_ENV === 'development' }

async function bootstrap()
{
    app.use(helmet());

    /** TODO: Configure allowed request origins for production */
    if(isDevEnv())
    {
        Logger.warn('Enabling CORS!');
        app.use(cors());
    }

    app.get('/isAlive', (req, res) => { res.status(200).send('Alive!'); })
    app.listen(PORT, HOST, () => { Logger.info(`Server listening on: http://${HOST}:${PORT}!`) });
}

bootstrap();