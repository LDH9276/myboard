import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './Reducers';

const initialState = {
  isLoggedIn: false,
  userId: '',
  userName: '',
  writer: '',
  content: '',
  uploadedComment: false,
  editCommentId: null,
  editAnswerId: null,
  editAnswerParent: null,
  totalCommentLists: [],
};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
});
  
export default store;