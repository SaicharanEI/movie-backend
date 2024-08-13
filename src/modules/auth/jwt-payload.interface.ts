export interface JwtPayload {
  email: string;
  sub: any;
  iat?: number;
  exp?: number;
}
