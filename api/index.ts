require('dotenv').config()

import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import Logger from './Logger';
import ApplicationRouter from './applicationRouter';
import init from './init';
import { body } from 'express-validator';
import passport from 'passport';

import setupAuth from './auth/setupAuth';

const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3000;

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
        saveUninitialized: false,
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