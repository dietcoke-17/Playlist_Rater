/**
 * Global error handler middleware.
 * Catches errors thrown (or passed via next(err)) in route handlers.
 * Logs the full error server-side and returns a sanitised JSON response.
 */

import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

interface AppError extends Error {
  status?: number;
  statusCode?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${req.method} ${req.path}`, err);

  // Axios errors from Spotify / external APIs
  if (axios.isAxiosError(err)) {
    const status = err.response?.status ?? 502;
    const message =
      (err.response?.data as { error?: { message?: string } })?.error?.message ??
      err.message;
    res.status(status).json({ error: message, source: 'upstream' });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Invalid or expired authentication token' });
    return;
  }

  // HTTP status from route
  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
  });
}
