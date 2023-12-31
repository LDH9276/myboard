export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const HEADERMENUON = 'HEADERMENUON';

export function headerMenuOn(headerMenu) {
  return {
    type: HEADERMENUON,
    payload: {
      headerMenu: headerMenu
    }
  };
}

export function login(userId, userName, userInfo, userProfile) {
  return {
    type: LOGIN,
    payload: {
        isLoggedIn: true, // isLoggedIn 상태값 변경
        userId: userId,
        userName: userName,
        userProfile: userProfile,
        userInfo: userInfo,
      }
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}