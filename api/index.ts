require('dotenv').config()

import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from './Logger';
import ApplicationRouter from './applicationRouter';

const app = express();

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3000;

/** Helpers **/
const isProdEnv = () => { return process.env.NODE_ENV === 'production' }

async function bootstrap()
{
    Logger.info(`Is production: ${isProdEnv()}`);
    app.use(helmet());

    /** TODO: Configure allowed request origins for production */
    if(!isProdEnv())
    {
        Logger.warn('Enabling CORS!');
    }
    else
    {
        // Configure for prod
        const viewPath = path.join(__dirname, 'views');
        app.use(express.static(viewPath));

        app.get('/', (req, res) => { res.sendFile(viewPath + 'index.html'); });
    }

    app.use('/api', ApplicationRouter);
    app.listen(PORT, HOST, () => { Logger.info(`Server listening on: http://${HOST}:${PORT}!`) });
}

bootstrap();