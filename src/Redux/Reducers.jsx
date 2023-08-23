import { LOGIN, LOGOUT } from './Loginout';

const initialState = {
  isLoggedIn: false,
  userId: '',
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userId: '',
      };
    default:
      return state;
  }
}

export default rootReducer;