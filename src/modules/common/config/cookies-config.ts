import { CookieOptions } from 'express';

export function RefreshCookiesConfig(): CookieOptions {
  return {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
}

export function AccessCookiesConfig(): CookieOptions {
  return {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
}
