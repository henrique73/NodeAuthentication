import passport from 'passport';
import tokens from '../utils/tokens';
import mongoose from 'mongoose';
import User from '../entities/user';
import { IUser } from '../interfaces/IUser';
import { Request, Response, NextFunction } from 'express';
import { IGetUserAuthInfoRequest } from '../interfaces/IUserRequest';

export = {
  local(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (erro, user) => {
      if (erro && erro.name === 'InvalidArgumentError') {
        return res.status(401).json({ erro: erro.message });
      }

      if (erro) {
        return res.status(500).json({ erro: erro.message });
      }

      if (!user) {
        return res.status(401).json();
      }

      req.user = user;
      return next();
    })(req, res, next);
  },

  bearer(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) {
    passport.authenticate('bearer', { session: false }, (error, user, info) => {
      if (error && error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: error.message });
      }

      if (error && error.name === 'TokenExpiredError') {
        return res
          .status(401)
          .json({ error: error.message, expiradoEm: error.expiredAt });
      }

      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (!user) {
        return res.status(401).json();
      }
      req.token = info.token;
      req.user = user;
      return next();
    })(req, res, next);
  },

  facebook(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('facebook', { session: false }, (erro, user) => {
      if (erro && erro.name === 'InvalidArgumentError') {
        return res.status(401).json({ erro: erro.message });
      }

      if (erro) {
        return res.status(500).json({ erro: erro.message });
      }

      if (!user) {
        return res.status(401).json();
      }

      req.user = user;
      return next();
    })(req, res, next);
  },

  google(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('google', { session: false }, (erro, user) => {
      if (erro && erro.name === 'InvalidArgumentError') {
        return res.status(401).json({ erro: erro.message });
      }

      if (erro) {
        return res.status(500).json({ erro: erro.message });
      }

      if (!user) {
        return res.status(401).json();
      }

      req.user = user;

      return next();
    })(req, res, next);
  },

  async verifyEmail(req: any, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      const id = await tokens.jwt.verify(token);
      const foundUser = await User.findById(mongoose.Types.ObjectId(id));
      req.user = foundUser;
      next();
    } catch (error) {
      if (error.name == 'JsonWebTokenError') {
        res.status(401).json({ error: error.message });
      }
      if (error.name === 'TokenExpiredError') {
        res
          .status(401)
          .json({ error: error.message, expiradoEm: error.expiredAt });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },
};
