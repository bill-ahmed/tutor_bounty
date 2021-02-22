import { Router, Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import Logger from "./Logger";
import User from "./models/user/user.model";

import UserRouter from "./routes/user.route";
import { MIN_PASSWORD_LENGTH } from "./utils/constants";
import { hashAndSalt } from "./utils/crypto";

const bodyParser = require('body-parser');

/** A router for the back-end API server */
const ApplicationRouter = Router();

ApplicationRouter.get('/isAlive', (req, res) => { res.status(200).send('Alive!'); })

// Actions for login/sign up
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

// Map controllers
ApplicationRouter.use('/users', UserRouter);

export default ApplicationRouter;