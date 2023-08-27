import { LOGIN, LOGOUT } from './Loginout';
import { READ, READ_WRITER } from './Read';
import { UPLOAD_COMMENT, UPLOADED_COMMENT, EDIT_COMMENT, EDIT_ANSWER } from './UploadComment';
import { COMMENT_LIST } from './CommentList';
import { LOGINMENUON, LOGINMENUOFF, SIGNUPMENUON, SIGNUPMENUOFF } from './MenuToggle';
import { BOARD_OPENED } from './Board';

const initialState = {
  isLoggedIn: false,
  userId: '',
  userName: '',
  userInfo: '',
  userProfile: '',
  writer: '',
  content: '',
  boardId: null,
  boardName: '',
  uploadedComment: false,
  editCommentId: null,
  editAnswerId: null,
  editAnswerParent: null,
  totalCommentLists: [],
  loginMenu: false,
  signupMenu: false
};

function rootReducer(state = initialState, action) {
  function clearLocalStorageAndCache() {
    localStorage.clear();
  }

  function boardInfoSave(boardId) {
    sessionStorage.setItem('boardId', boardId);
  }

  switch (action.type) {
    case LOGINMENUON:
      return {
        ...state,
        loginMenu: true,
        signupMenu: false
      };
    case LOGINMENUOFF:
      return {
        ...state,
        loginMenu: false,
        signupMenu: false
      };
    case SIGNUPMENUON:
      return {
        ...state,
        signupMenu: true,
        loginMenu: false
      };
    case SIGNUPMENUOFF:
      return {
        ...state,
        signupMenu: false,
        loginMenu: false
      };
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        loginMenu: false,
        userId: action.payload.userId,
        userName: action.payload.userName,
        userProfile: action.payload.userProfile,
        userInfo: action.payload.userInfo,
      };
    case LOGOUT:
      clearLocalStorageAndCache();
      return {
        ...state,
        isLoggedIn: false,
        userId: '',
        userName: '',
        userProfile: '',
        userInfo: ''
      };
    case BOARD_OPENED:
      boardInfoSave(action.payload.boardId);
      return {
        ...state,
        boardId: action.payload.boardId,
        boardName: action.payload.boardName
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