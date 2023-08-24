import { LOGIN, LOGOUT } from './Loginout';
import { READ } from './Read';
import { UPLOAD_COMMENT, UPLOADED_COMMENT, EDIT_COMMENT } from './UploadComment';

const initialState = {
  isLoggedIn: false,
  userId: '',
  writer: '',
  content: '',
  uploadedComment: false,
  editCommentId: null
};

function rootReducer(state = initialState, action) {
  function clearLocalStorageAndCache() {
    localStorage.clear();
  }

  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        userId: action.payload.userId,
      };
    case LOGOUT:
      clearLocalStorageAndCache();
      return {
        ...state,
        isLoggedIn: false,
        userId: '',
      };
    case READ:
      return {
        ...state,
        writer: action.payload.writer,
        content: action.payload.content,
      };
    case UPLOAD_COMMENT:
      return {
        ...state,
        uploadedComment: true
      };
    case EDIT_COMMENT:
      return {
        ...state,
        editCommentId: action.payload.editCommentId
      };
    case UPLOADED_COMMENT:
      return {
        ...state,
        uploadedComment: false,
        editCommentId: null
      };

      
    default:
      return state;
  }
}

export default rootReducer;