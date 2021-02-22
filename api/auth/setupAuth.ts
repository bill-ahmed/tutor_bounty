import passport from 'passport'
import passportLocal from "passport-local";
import User from '../models/user/user.model';

const LocalStrategy = passportLocal.Strategy

export default function setupAuth() {
    passport.use(new LocalStrategy(
        async function(email, password, done) {
            let user = await User.findOne({ email });

            if(!user || !user.validPassword(password))
                return done(null, false, { message: 'Incorrect email/password.' });
            
            return done(null, user);
        }
    ))
}