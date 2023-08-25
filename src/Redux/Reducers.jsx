import { LOGIN, LOGOUT } from './Loginout';
import { READ } from './Read';
import { UPLOAD_COMMENT, UPLOADED_COMMENT, EDIT_COMMENT, EDIT_ANSWER } from './UploadComment';
import { COMMENT_LIST } from './CommentList';

const initialState = {
  isLoggedIn: false,
  userId: '',
  userName: '',
  userInfo: '',
  writer: '',
  content: '',
  uploadedComment: false,
  editCommentId: null,
  editAnswerId: null,
  editAnswerParent: null,
  totalCommentLists: [],
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
        userName: action.payload.userName,
        userInfo: action.payload.userInfo,
      };
    case LOGOUT:
      clearLocalStorageAndCache();
      return {
        ...state,
        isLoggedIn: false,
        userId: '',
        userName: '',
        userInfo: ''
      };
    case READ:
      return {
        ...state,
        writer: action.payload.writer,
        content: action.payload.content,
      };
    case COMMENT_LIST :
      return {
        ...state,
        totalCommentLists: action.payload.totalCommentLists
      };
      
    case UPLOAD_COMMENT:
      return {
        ...state,
        uploadedComment: true,
        editCommentId: null,
        editAnswerId: null        
      };
    case EDIT_COMMENT:
      return {
        ...state,
        editCommentId: action.payload.editCommentId
      };
    case EDIT_ANSWER:
      return {
        ...state,
        editAnswerId: action.payload.editAnswerId,
        editAnswerParent: action.payload.editAnswerParent
      };
    case UPLOADED_COMMENT:
      return {
        ...state,
        uploadedComment: false,
        editCommentId: null,
        editAnswerId: null
      };

      
    default:
      return state;
  }
}

export default rootReducer;