import passport from 'passport';
import * as passportLocal from 'passport-local';
import * as passportHttpBearer from 'passport-http-bearer';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../entities/user';
import tokens from '../utils/tokens';
const { InvalidArgumentError } = require('../utils/error');

const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const LocalStrategy = passportLocal.Strategy;
const BearerStrategy = passportHttpBearer.Strategy;

async function verifyPassword(password: string, hashPassword: string) {
  const validPassword = await bcrypt.compare(password, hashPassword);
  if (!validPassword) {
    throw new InvalidArgumentError('Invalid username or password');
  }
}

export default passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    async (name: string, password: string, done: any) => {
      try {
        const user = await User.findOne({ name });

        if (!user) {
          throw new InvalidArgumentError('User does not exist');
        }

        await verifyPassword(password, user.password);

        done(null, user);
      } catch (erro) {
        done(erro);
      }
    }
  )
);

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const id = await tokens.jwt.verify(token);
      const user = await User.findById(mongoose.Types.ObjectId(id));
      done(null, user, { scope: token });
    } catch (erro) {
      done(erro);
    }
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: [
        'email',
        'id',
        'first_name',
        'gender',
        'last_name',
        'picture',
      ],
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      console.log(profile);
      // eslint-disable-next-line no-param-reassign, no-underscore-dangle
      const username = profile._json.first_name + '.' + profile._json.last_name;
      const res = await User.findOne({ facebookId: profile.id });
      const token = {
        token: jwt.sign(
          { username: username, _id: profile._id },
          process.env.JWT_KEY as string
        ),
      };

      if (res) {
        console.log('Authenticating existing user');
        done(null, profile, token);
      } else {
        console.log('Creating new User');
        new User({
          name: username,
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          email: profile._json.email,
          facebookId: profile.id,
        }).save();
        done(null, profile);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    async function (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) {
      console.log(profile);

      const username = profile.displayName;
      const res = await User.findOne({ googleId: profile.id });
      const jwtToken = {
        token: jwt.sign(
          { username: username, _id: profile._id },
          process.env.JWT_KEY as string
        ),
      };

      if (res) {
        console.log('Authenticating existing user');
        done(null, profile, jwtToken);
      } else {
        console.log('Creating new User');
        new User({
          name: username,
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          email: profile._json.email,
          googleId: profile.id,
        }).save();
        done(null, profile);
      }
    }
  )
);

/*passport.use(
  new AppleStrategy(
    {
      clientID: '',
      teamID: '',
      callbackURL: 'http://localhost:3000/auth/apple/callback',
      keyID: '',
      privateKeyLocation: '',
      passReqToCallback: true,
    },
    async function (
      req: any,
      accessToken: string,
      refreshToken: string,
      idToken: string,
      profile: any,
      cb: any
    ) {
      // The idToken returned is encoded. You can use the jsonwebtoken library via jwt.verify(idToken)
      // to access the properties of the decoded idToken properties which contains the user's identity information.
      const decoded: any = jwt_decode(idToken);
      const user = await User.findOne({ appleId: decoded.sub });

      // Here, check if the idToken.sub exists in your database!
      // idToken should contains email too if user authorized it but will not contain the name

      const jwtToken = {
        token: jwt.sign(
          { username: decoded.username<<, _id: decoded.sub },
          process.env.JWT_KEY as string
        ),
      };

      if (user) {
        console.log('Authenticating existing user');
        cb(null, user, jwtToken);
      } else {
        console.log('Creating new User');
        new User({
          name: << ,
          // eslint-disable-next-line no-param-reassign, no-underscore-dangle
          email: <<,
          googleId: <<,
        }).save();
        cb(null, user);
      }
    }
  )
);*/
