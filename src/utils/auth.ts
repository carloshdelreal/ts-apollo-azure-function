import { JwtUser } from '../types';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';

const SALT_ROUND = 10;

export const { JWT_SECRET = 'undefined' } = process.env;

export const validateEmail = (email: string): boolean => {
  // eslint-disable-next-line max-len
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

export const verifyUser = (token: string): JwtUser => {
  return jwt.verify(token, JWT_SECRET) as JwtUser;
};

export const encryptCredential = async (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const SALT = bcrypt.genSaltSync(SALT_ROUND);

    bcrypt.hash(password, SALT, null, (err, hash) => {
      if (err) {
        return reject(err);
      }
      resolve(hash);
    });
  });

export const validateCredential = async (
  value: string,
  hashedValue: string,
): Promise<boolean> => new Promise<boolean>((resolve, reject) => {
  bcrypt.compare(value, hashedValue, (err, res) => {
    if (err) {
      return reject(err);
    }
    resolve(res);
  });
});
