import { Router, Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import passport from "passport";
import Logger from "./utils/logger";
import User from "./models/user/user.model";

import UserRouter from "./routes/user.route";
import { MAX_NAME_LENGTH, MAX_USERNAME_LENGTH, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, SESSION_NAME, USERNAME_REGEX } from "./utils/constants";
import { hashAndSalt } from "./utils/crypto";
import { applicationRoot, isProdEnv } from "./utils/utils";
import UserPostingRouter from "./routes/user_posting.route";
import { RequireAuthentication } from "./middleware/authentication.middleware";

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
        return res.status(400).json(errors.array({ onlyFirstError: true }));
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

    await check('name', `Name can be at most ${MAX_NAME_LENGTH} characters!`)
          .isString()
          .isLength({ max: MAX_NAME_LENGTH })
          .run(req);

    // Validate user input
    await check('username', 'Username is not valid! May only contain alphanumeric characters or underscores.')
          .isString()
          .trim()
          .isLength({ min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH })
          .matches(USERNAME_REGEX)
          .toLowerCase()
          .run(req);

    await check('email', 'Email is not valid!')
          .isString()
          .isLength({ min: 1 })
          .trim()
          .normalizeEmail({"gmail_remove_dots": false, "gmail_remove_subaddress": false, "outlookdotcom_remove_subaddress": false})
          .isEmail()
          .run(req);

    await check('password', `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`)
          .isLength({ min: MIN_PASSWORD_LENGTH })
          .run(req);

    await check('confirmPassword', 'Password do not match!')
          .equals(req.body.password)
          .run(req);

    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json(errors.array({ onlyFirstError: true }));
    }
    else
    {
        let user = await User.findOne({ email: req.body.email });
        
        // If they already exist, error!
        if(user)
        {
          Logger.debug(`User with email ${req.body.email} already exists!`);
          return res.status(400).json([{ msg: 'A user with that email already exists!' }]);
        }

        let user_username = await User.findOne({ username: req.body.username });

        if(user_username)
        {
          Logger.debug(`User with username ${req.body.username} already exists!`);
          return res.status(400).json([{ msg: 'A user with that username exists!' }]);
        }
            
        user = await User.create({
            email: req.body.email,
            password: hashAndSalt(req.body.password),
            name: req.body.name || '',
            username: req.body.username
        });

        try {
            await user.save();

            req.login(user, (err) => {
              if(err) { Logger.error(err); return res.sendStatus(500); }

              return res.sendStatus(200);
            })
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

/** 
 * Map URL to appropriate router
 * 
 * ALL PROTECTED ROUTES MUST USE "RequireAuthentication"!
 * 
 * */
ApplicationRouter.use('/users', RequireAuthentication, UserRouter);
ApplicationRouter.use('/userPostings', RequireAuthentication, UserPostingRouter);


// All other routes are dead ends
ApplicationRouter.use('*', (req, res) => { res.sendStatus(404); });

export default ApplicationRouter;