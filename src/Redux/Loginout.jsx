export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export function login(userId, userName, userInfo) {
  return {
    type: LOGIN,
    payload: {
        isLoggedIn: true, // isLoggedIn 상태값 변경
        userId: userId,
        userName: userName,
        userInfo: userInfo,
      }
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}