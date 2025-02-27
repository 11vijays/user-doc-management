export const ACTIONS: Record<string, string> = {
  POST: 'created',
  PUT: 'updated',
  PATCH: 'modified',
  DELETE: 'deleted',
  GET: 'retrieved',
  DEFAULT: 'processed',
  UPLOAD: 'uploaded',
};

export const HTTP_METHODS = {
  CREATE: 'POST',
  UPDATE: 'PUT',
  MODIFY: 'PATCH',
  DELETE: 'DELETE',
  FETCH: 'GET',
  UPLOAD: 'UPLOAD',
};

export const AUTH_MESSAGE = {
  USER_NOT_EXIST:
    'Invalid email or password. Please check your credentials and try again.',
  LOGOUT: 'User Logged out successfully',
  TOKEN_EXPIRED: 'Token expired, please login again',
  USER_NOT_FOUND: 'User not found',
  PERMISSION_ERROR: 'You do not have permission',
  EDITOR_PERMISSION_ERROR: 'You do not have permission',
};

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}
