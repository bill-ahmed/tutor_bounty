require('dotenv').config()

import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from './utils/logger';
import ApplicationRouter from './applicationRouter';
import init from './init';
import { body } from 'express-validator';
import passport from 'passport';

import setupAuth from './auth/setupAuth';
import { SESSION_MAX_AGE } from './utils/constants';
import RedisClient from './utils/redis';

const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3000;

// Persist sessions
const RedisStore = require('connect-redis')(session)

/** Helpers **/
const isProdEnv = () => { return process.env.NODE_ENV === 'production' }

async function bootstrap()
{
    Logger.info(`Is production: ${isProdEnv()}`);
    
    app.use(helmet());

    setupAuth();

    // Authentication middleware
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: SESSION_MAX_AGE
        },
        name: 'tutor_bounty.sid',
        store: new RedisStore({ client: RedisClient, ttl: SESSION_MAX_AGE })
    }));
    app.use(passport.initialize());
    app.use(passport.session());


    /** TODO: Configure allowed request origins for production */
    if(!isProdEnv())
    {
        app.use((req, res, next) => { Logger.debug(`[${req.method}] ${req.url}`); next(); });
    }
    else
    {
        // Enable secure cookie from first proxy (something like Nginx preferably)
        app.set('trust proxy', 1);
        session.cookie.secure = true;

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