require('dotenv').config()

import express from 'express';
import helmet from 'helmet';
import Logger from './Logger';

const app = express();

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3002;

async function bootstrap()
{
    app.use(helmet());

    app.listen(PORT, HOST, () => { Logger.info(`Server listening on: http://${HOST}:${PORT}!`) });
}

bootstrap();