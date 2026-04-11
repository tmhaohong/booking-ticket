import crypto from 'crypto';

export const hashPassword = (pass: string, salt: string): Promise<string> =>
  new Promise((resolve, reject) =>
    crypto.scrypt(pass.normalize(), salt, 64, (error, hash) =>
      error ? reject(error) : resolve(hash.toString('hex').normalize()),
    ),
  );

export const generateRandom = (lenght: number = 16) =>
  crypto.randomBytes(lenght).toString('hex').normalize();
