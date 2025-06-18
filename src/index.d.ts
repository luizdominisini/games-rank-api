declare global {
  namespace Express {
    interface Request {
      user?: {
        gamer_id: number;
        gamer_name: string;
        gamer_username: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export {};
