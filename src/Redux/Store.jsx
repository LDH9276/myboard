import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Reducers';

const initialState = {
  isLoggedIn: false,
  userId: '',
};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
});
  
export default store;