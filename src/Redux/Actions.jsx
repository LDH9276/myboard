export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function login(userId) {
  return {
    type: LOGIN,
    payload: {
        isLoggedIn: true, // isLoggedIn 상태값 변경
        userId: userId,
      }
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}