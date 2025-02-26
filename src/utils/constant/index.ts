export const ACTIONS: Record<string, string> = {
  POST: 'created',
  PUT: 'updated',
  PATCH: 'modified',
  DELETE: 'deleted',
  GET: 'retrieved',
  DEFAULT: 'processed',
};

export const HTTP_METHODS = {
  CREATE: 'POST',
  UPDATE: 'PUT',
  MODIFY: 'PATCH',
  DELETE: 'DELETE',
  FETCH: 'GET',
};

export const AUTH_MESSAGE = {
  USER_NOT_EXIST:
    'Invalid email or password. Please check your credentials and try again.',
  LOGOUT: 'User Logged out successfully',
};
