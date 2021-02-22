require('dotenv').config()

import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from './Logger';
import ApplicationRouter from './applicationRouter';
import init from './init';

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
        app.use((req, res, next) => { Logger.debug(`[${req.method}] ${req.url}`); next(); });
    }
    else
    {
        // Configure for prod
        const viewPath = path.join(__dirname, 'views');
        app.use(express.static(viewPath));

        app.get('/', (req, res) => { res.sendFile(viewPath + 'index.html'); });
    }
    
    app.use('/api', ApplicationRouter);
    app.use((req, res) => { res.sendStatus(404); });

    await init();
    app.listen(PORT, HOST, () => { Logger.info(`Server listening on: http://${HOST}:${PORT}!`) });
}

bootstrap();