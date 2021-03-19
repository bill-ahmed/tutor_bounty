require('dotenv').config()

import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

const { ExpressPeerServer } = require('peer');

import Logger from './utils/logger';
import ApplicationRouter from './applicationRouter';
import init from './init';
import { body } from 'express-validator';
import passport from 'passport';

import setupAuth from './auth/setupAuth';
import { SESSION_MAX_AGE, SESSION_NAME } from './utils/constants';
import RedisClient from './utils/redis';
import { isProdEnv } from './utils/utils';
import { RequireAuthentication } from './middleware/authentication.middleware';

const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

/** Constants **/
const HOST = process.env.HOST || '127.0.0.1';
const PORT = parseInt(process.env.PORT) || 3000;

// Persist sessions
const RedisStore = require('connect-redis')(session)

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
            maxAge: SESSION_MAX_AGE,
            secure: isProdEnv(),
            httpOnly: isProdEnv()
        },
        name: SESSION_NAME,
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

        // Configure for prod
        const viewPath = path.join(__dirname, 'views');
        app.use(express.static(viewPath));

        app.get('/', (req, res) => { res.sendFile(viewPath + 'index.html'); });
    }

    app.use('/api', ApplicationRouter);

    // Let vue-router handle 404s
    // This was needed because we disabled history api: https://router.vuejs.org/guide/essentials/history-mode.html#caveat
    app.use((req, res) => { res.redirect('/#' + req.url); });

    await init();
    const server = app.listen(PORT, HOST, () => { Logger.info(`Server listening on: http://${HOST}:${PORT}!`) });

    // Peer JS dependency
    const peerServer = ExpressPeerServer(server, {
      debug: !isProdEnv(),
      proxied: true,
    });
    
    app.use('/peerjs', RequireAuthentication, peerServer);
    
    
    peerServer.on('connection', (client) => { console.log('client connected');});
    peerServer.on('disconnect', (client) => { console.log('client disconnected');});
}

bootstrap();