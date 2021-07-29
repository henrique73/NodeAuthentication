import jwt from 'jsonwebtoken';

function createTokenJWT(id: string): string {
  const payload = { id };

  const token = jwt.sign(payload, process.env.JWT_KEY as string);
  return token;
}

function verifyTokenJWT(token: string): string {
  const { id } = jwt.verify(token, process.env.JWT_KEY as string) as any;
  return id;
}

export = {
  jwt: {
    /**
     * Create a new JWT Token with the user ID as it's payload
     * @param id
     * @returns return the JWT Token
     */
    create(id: string) {
      return createTokenJWT(id);
    },
    /**
     * Verifies tokens with JWT Key and passes the ID on the payload
     * @param token
     * @returns Verified User Id
     */
    verify(token: string) {
      return verifyTokenJWT(token);
    },
  },
};
