import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const Errors = {
  unauthorized: (msg = 'Authentication required') => new ApiError(401, msg, 'UNAUTHORIZED'),
  forbidden: (msg = 'Access denied') => new ApiError(403, msg, 'FORBIDDEN'),
  notFound: (msg = 'Resource not found') => new ApiError(404, msg, 'NOT_FOUND'),
  badRequest: (msg: string) => new ApiError(400, msg, 'BAD_REQUEST'),
  conflict: (msg: string) => new ApiError(409, msg, 'CONFLICT'),
  tooManyRequests: (msg = 'Too many requests') => new ApiError(429, msg, 'TOO_MANY_REQUESTS'),
  internal: (msg = 'Internal server error') => new ApiError(500, msg, 'INTERNAL_ERROR'),
};

interface ErrorBody {
  error: string;
  code?: string;
  details?: unknown;
}

export function errorResponse(err: unknown): NextResponse<ErrorBody> {
  if (err instanceof ApiError) {
    return NextResponse.json(
      { error: err.message, ...(err.code && { code: err.code }) },
      { status: err.statusCode },
    );
  }

  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', code: 'VALIDATION_ERROR', details: err.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error('[API Error]', err);
  }

  return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 });
}

type RouteHandler<T = unknown> = (...args: T[]) => Promise<NextResponse>;

export function withErrorHandler<T = unknown>(handler: RouteHandler<T>): RouteHandler<T> {
  return async (...args: T[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      return errorResponse(err);
    }
  };
}
