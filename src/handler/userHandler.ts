import { Request, Response } from 'express';
import User from '../entities/user';
import { IGetUserAuthInfoRequest } from '../interfaces/IUserRequest';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import tokens from '../utils/tokens';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import mailer from '../mailing/emails';

export = {
  /**
   * Will create a new local User
   * @param req
   * @param res
   */
  async create(context: Context, req: Request, res: Response) {
    const { name, password, email } = req.body;

    //Verifica se foram preenchidos os campos de Input
    if (!name || !password || !email) {
      res.status(422).json({ error: 'missing fields' });
    }

    try {
      const user = new User({
        name,
        email,
        verifiedEmail: 0,
      });
      //Encriptografa a senha do usuario utilizando Bcrypt com 12 de Salt Rounds
      user.password = await bcrypt.hash(password, 12);

      //Salva o usuario no banco de dados
      await user.save();

      //Manda o Email de verificação para o usuario
      const token = tokens.jwt.create(user.id);
      mailer(email, 'http://localhost:3000/users/verifyEmail/' + token);

      res.status(201).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async login(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const accessToken = tokens.jwt.create(req.user.id);
      res.set('Authorization', accessToken);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async protected(req: Request, res: Response) {
    res.send('this route requires a JWT token to be accessed');
  },

  async facebookCallback(req: any, res: Response) {
    res.status(200).json({});
  },

  async googleCallback(req: any, res: Response) {
    res.status(200).json({});
  },

  async verifyEmail(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const foundUser = req.user;
      await User.updateOne(
        { _id: mongoose.Types.ObjectId(foundUser.id) },
        { $set: { verifiedEmail: 1 } }
      );
      res.status(200).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async upload(req: Request, res: Response) {
    console.log(req.file);

    if (!req.file) {
      res.send('error');
    } else {
      res.send('sucess');
    }
  },
};
