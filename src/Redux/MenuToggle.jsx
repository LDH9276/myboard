export const LOGINMENUON = 'LOGINMENUON';
export const LOGINMENUOFF = 'LOGINMENUOFF';
export const SIGNUPMENUON = 'SIGNUPMENUON';
export const SIGNUPMENUOFF = 'SIGNUPMENUOFF';

export function loginMenuOn() {
  return {
    type: LOGINMENUON,
  };
}

export function loginMenuOff() {
  return {
    type: LOGINMENUOFF,
  };
}

export function signupMenuOn() {
  return {
    type: SIGNUPMENUON,
  };
}

export function signupMenuOff() {
  return {
    type: SIGNUPMENUOFF,
  };
}