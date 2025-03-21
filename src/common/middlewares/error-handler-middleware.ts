import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/http-errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
