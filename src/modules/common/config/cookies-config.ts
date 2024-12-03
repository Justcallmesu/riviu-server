export function RefreshCookiesConfig() {
  return {
    secure: true,
    httpOnly:true,
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
}

export function AccessCookiesConfig() {
  return {
    secure: true,
    httpOnly:true,
    signed: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
}
