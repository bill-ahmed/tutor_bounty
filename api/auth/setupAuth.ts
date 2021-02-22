import passport from 'passport'
import passportLocal from "passport-local";
import Logger from '../Logger';
import User from '../models/user/user.model';

const LocalStrategy = passportLocal.Strategy

/** Configure authentication flows with passport */
export default function setupAuth() {
    Logger.info('Setting up passport...');
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async function(email, password, done) {
            let user = await User.findOne({ email });

            if(!user || !user.validPassword(password))
                return done(null, false, { message: 'Incorrect email/password.' });
            
            return done(null, user);
        }
    ));

    passport.serializeUser((user: any, done) => {
        let uid = user._id.toString();
        done(null, uid);
    });

    passport.deserializeUser((uid: string, done) => {
        User.findById(uid, (err, user) => {
            done(err, user);
        })
    })
}