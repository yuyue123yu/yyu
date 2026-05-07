// Super Admin Error Classes and Handling

/**
 * Base class for all super admin errors
 */
export class SuperAdminError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number = 500, code: string = 'SUPER_ADMIN_ERROR', details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication errors
 */
export class AuthenticationError extends SuperAdminError {
  constructor(message: string = 'Authentication failed', details?: any) {
    super(message, 401, 'AUTHENTICATION_ERROR', details);
  }
}

/**
 * Authorization errors
 */
export class AuthorizationError extends SuperAdminError {
  constructor(message: string = 'Insufficient permissions', details?: any) {
    super(message, 403, 'AUTHORIZATION_ERROR', details);
  }
}

/**
 * Validation errors
 */
export class ValidationError extends SuperAdminError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends SuperAdminError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(message, 404, 'NOT_FOUND_ERROR', details);
  }
}

/**
 * Conflict errors
 */
export class ConflictError extends SuperAdminError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(message, 409, 'CONFLICT_ERROR', details);
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends SuperAdminError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 429, 'RATE_LIMIT_ERROR', details);
  }
}

/**
 * Database errors
 */
export class DatabaseError extends SuperAdminError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 500, 'DATABASE_ERROR', details);
  }
}

/**
 * External service errors
 */
export class ExternalServiceError extends SuperAdminError {
  constructor(message: string = 'External service error', details?: any) {
    super(message, 502, 'EXTERNAL_SERVICE_ERROR', details);
  }
}

/**
 * Session errors
 */
export class SessionError extends SuperAdminError {
  constructor(message: string = 'Session error', details?: any) {
    super(message, 401, 'SESSION_ERROR', details);
  }
}

/**
 * MFA errors
 */
export class MFAError extends SuperAdminError {
  constructor(message: string = 'MFA verification failed', details?: any) {
    super(message, 401, 'MFA_ERROR', details);
  }
}

/**
 * Error response interface
 */
export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
  details?: any;
  timestamp: string;
  path?: string;
}

/**
 * Handle super admin errors and return appropriate response
 * @param error - Error object
 * @param path - Request path
 * @returns Error response object
 */
export function handleSuperAdminError(error: unknown, path?: string): ErrorResponse {
  const timestamp = new Date().toISOString();

  // Handle SuperAdminError instances
  if (error instanceof SuperAdminError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
      timestamp,
      path,
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      timestamp,
      path,
    };
  }

  // Handle unknown errors
  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
    timestamp,
    path,
  };
}

/**
 * Log error to console with context
 * @param error - Error object
 * @param context - Additional context
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  const timestamp = new Date().toISOString();
  
  console.error('='.repeat(80));
  console.error(`[${timestamp}] Super Admin Error`);
  
  if (error instanceof SuperAdminError) {
    console.error(`Code: ${error.code}`);
    console.error(`Status: ${error.statusCode}`);
    console.error(`Message: ${error.message}`);
    if (error.details) {
      console.error('Details:', JSON.stringify(error.details, null, 2));
    }
  } else if (error instanceof Error) {
    console.error(`Message: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
  } else {
    console.error('Unknown error:', error);
  }
  
  if (context) {
    console.error('Context:', JSON.stringify(context, null, 2));
  }
  
  console.error('='.repeat(80));
}

/**
 * Check if error should be logged to audit log
 * @param error - Error object
 * @returns true if error should be logged
 */
export function shouldLogToAudit(error: unknown): boolean {
  if (error instanceof AuthenticationError) return true;
  if (error instanceof AuthorizationError) return true;
  if (error instanceof MFAError) return true;
  if (error instanceof SessionError) return true;
  return false;
}

/**
 * Get user-friendly error message
 * @param error - Error object
 * @returns User-friendly message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof AuthenticationError) {
    return 'Authentication failed. Please check your credentials and try again.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error instanceof ValidationError) {
    return 'The provided data is invalid. Please check your input and try again.';
  }
  
  if (error instanceof NotFoundError) {
    return 'The requested resource was not found.';
  }
  
  if (error instanceof ConflictError) {
    return 'This operation conflicts with existing data.';
  }
  
  if (error instanceof RateLimitError) {
    return 'Too many requests. Please try again later.';
  }
  
  if (error instanceof DatabaseError) {
    return 'A database error occurred. Please try again later.';
  }
  
  if (error instanceof ExternalServiceError) {
    return 'An external service is currently unavailable. Please try again later.';
  }
  
  if (error instanceof SessionError) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (error instanceof MFAError) {
    return 'Multi-factor authentication failed. Please check your code and try again.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
}
