export const ROUTES = {
  AUTH: 'auth',
  USERS: 'users',
  TODOS: 'todos',
};

export const SUBROUTES = {
  REGISTER: 'register',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REFRESH: 'refresh',

  TOGGLE_SUBSCRIBE: 'follow/:userId',

  DELETE_TODO: ':todoId',
  UPDATE_TODO: ':todoId',
};
