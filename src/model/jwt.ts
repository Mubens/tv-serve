import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';

interface PayLoad {
  id: number;
  name: string;
}

type VerfiyObject = PayLoad & {
  iat: number;
  exp?: number;
};

const privateKey = readFileSync('private.key');

class Jwt {
  token: string;

  constructor(payload: PayLoad, options?: jwt.SignOptions) {
    this.token = jwt.sign(payload, privateKey, options);
  }

  static verify(authorization: string) {
    const token = authorization.split('Bearer ')[1];

    if (!token) {
      return { token: false, data: null };
    }

    try {
      const data = jwt.verify(token, privateKey) as VerfiyObject;
      return { token: true, data };
    } catch (err) {
      return { token: false, data: null };
    }
  }

  toString() {
    return this.token;
  }
}

export default Jwt;
