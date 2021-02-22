import passport from 'passport'
import passportLocal from 'passport-local';
import googleAuth from 'passport-google-oauth';

import Logger from '../utils/logger';
import User from '../models/user/user.model';

const LocalStrategy = passportLocal.Strategy
const GoogleStrategy = googleAuth.OAuth2Strategy;

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

    passport.use(new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async function(accessToken, refreshToken, profile, done) {
        console.log(JSON.stringify({ accessToken, refreshToken, profile }));
        
        let user = await User.findOne({ authId: profile.id });
        if(user)
        {
          done(null, user);
        }
        else {
          let email = profile.emails[0].value;
          let emailVerified = profile.emails[0].emailVerified

          // Create new user!
          user = await User.create({
            email, emailVerified,
            name: profile.displayName,
            profileImageURL: profile._json.picture
          });

          await user.save();
          done(null, user);
        }
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