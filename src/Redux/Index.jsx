import { combineReducers } from 'redux';
import { LOGIN, LOGOUT } from './Loginout';

const rootReducer = combineReducers({
  LOGIN, LOGOUT
});

export default rootReducer;