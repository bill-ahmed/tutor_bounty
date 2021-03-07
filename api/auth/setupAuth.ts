import passport from 'passport'
import passportLocal from 'passport-local';
import googleAuth from 'passport-google-oauth';

import Logger from '../utils/logger';
import User from '../models/user/user.model';
import { GenerateRandomString } from '../utils/utils';

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
        let email = profile.emails[0].value;

        let user = await User.findOne({ email: email });
        if(user)
        {
          done(null, user);
        }
        else {
          let emailVerified = profile.emails[0].emailVerified;
          let username = email;

          let allowedChars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
          
          //
          // Randomly generate username for this new user.
          // Check 10 times if the username is not already taken
          // Probability of this failing several times is EXTREMELY LOW.
          // Probability of a SINGLE collision IS 1 / 62^32
          //
          // If it does fail every iteration, we fallback to their email.
          // If that fails too...welp :)
          //
          for(let i = 0; i < 10; i++)
          {
            let uid = GenerateRandomString(32, allowedChars);
            let userExists = await User.exists({ username: uid });

            if(!userExists)
            {
              username = uid;
              break;
            }
          }

          // Create new user!
          user = await User.create({
            email, emailVerified,
            username: username,
            name: profile.displayName,
            profileImageURL: profile._json.picture,
            authId: profile.id,
            authProvider: 'google'
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