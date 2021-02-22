import { Router, Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import passport from "passport";
import Logger from "./utils/logger";
import User from "./models/user/user.model";

import UserRouter from "./routes/user.route";
import { MIN_PASSWORD_LENGTH, SESSION_NAME } from "./utils/constants";
import { hashAndSalt } from "./utils/crypto";
import { applicationRoot, isProdEnv } from "./utils/utils";

const bodyParser = require('body-parser');

/** A router for the back-end API server */
const ApplicationRouter = Router();

ApplicationRouter.get('/isAlive', (req, res) => { console.log('request user: ', req.user); res.status(200).send('Application router alive!'); })

/** Login existing local user
 * @route POST /api/login
 */
ApplicationRouter.post('/login', bodyParser.json(), async (req, res, next) => {
    await check('email', 'Email is not valid!').isEmail().normalizeEmail().run(req);
    await check('password', `Password must be present!`).isLength({ min: 1 }).run(req);

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.sendStatus(400);
    }

    // Kick em out if already logged in!
    req.logout();

    Logger.debug(`Authenticating user: ${req.body.email}`);
    passport.authenticate('local', (err, user, msg) => {
        if(err)
            return res.sendStatus(500);
        
        // If user doesn't exist or invalid password
        if(!user)
            return res.status(404).json(msg);
        
        req.login(user, (err) => {
            if(err)
                return res.sendStatus(500);
            return res.sendStatus(200);
        })
    })(req, res, next);
})

/** Sign up a new local user
 * @route POST /api/signup
 */
ApplicationRouter.post('/signup', bodyParser.json(), async (req, res) => {
    Logger.debug(JSON.stringify(req.body));

    // Validate user input
    await check('email', 'Email is not valid!').isEmail().normalizeEmail().run(req);
    await check('password', `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`).isLength({ min: MIN_PASSWORD_LENGTH }).run(req);
    await check('confirmPassword', 'Password do not match!').equals(req.body.password).run(req);

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json(errors.array());
    }
    else
    {
        let user = await User.findOne({ email: req.body.email });
        
        // If they already exist, error!
        if(user)
            return res.status(400).json([{ msg: 'A user with that email already exists!' }]);
        
        user = await User.create({
            email: req.body.email,
            password: hashAndSalt(req.body.password),
        });

        try {
            await user.save();
            return res.sendStatus(200);
        } catch (error) {
            Logger.error('Failed to save new user.')
            Logger.error(error.stack);
            res.sendStatus(500);
        }
    }
});

/** Sign in Google Account user
 * @route /api/auth/google
 */
ApplicationRouter.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }));


 /** Callback for when sign in complete
  * @route /api/auth/google/callback
  */
ApplicationRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: applicationRoot() }), async (req, res) => {
  Logger.debug('Callback triggered from Google sign in!');
  

  return res.redirect(applicationRoot());
});

/** Logout current user
 * @route /api/logout
 */
ApplicationRouter.post('/logout', (req, res) => {
    // TODO: Also nuke session from redis
    req.logout();    
    res.sendStatus(200);
})

/** Current user, if logged in */
ApplicationRouter.use('/currentUser', (req, res) => {
  return res.json(req.user);
});

// Map controllers
ApplicationRouter.use('/users', UserRouter);

export default ApplicationRouter;