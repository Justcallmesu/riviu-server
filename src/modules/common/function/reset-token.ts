import { Response } from 'express';

export default function ResetToken(res: Response) {
  res.cookie('token', '', {
    signed: true,
    expires: new Date(Date.now()),
  });
}
