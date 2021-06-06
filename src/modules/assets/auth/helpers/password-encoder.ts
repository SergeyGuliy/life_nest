// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

const saltRounds = 2;

export function generatePasswordHash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, function (err1, salt) {
      bcrypt.hash(password, salt, function (err2, hash) {
        if (err1) {
          reject(err1);
        } else if (err2) {
          reject(err2);
        } else {
          resolve(hash);
        }
      });
    });
  });
}

export function checkPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
