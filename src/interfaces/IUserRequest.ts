import { Request } from 'express';

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: string;
    name: string;
    password: string;
    email: string;
  };
  token: string;
}
