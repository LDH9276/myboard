import { persistReducer } from "redux-persist";
import { LOGIN, LOGOUT } from "./Loginout";
import { ERROR_WINDOW_ON, ERROR_WINDOW_OFF } from "./Error";
import { LOADING, READ } from "./Read";
import { UPLOAD_COMMENT, UPLOADED_COMMENT, EDIT_COMMENT, EDIT_ANSWER } from "./UploadComment";
import { COMMENT_LIST } from "./CommentList";
import { LOGINMENUON, LOGINMENUOFF, SIGNUPMENUON, SIGNUPMENUOFF } from "./MenuToggle";
import { BOARD_OPENED, BOARD_LIMIT, BOARD_SUBSCRIBE } from "./Board";
import { HEADERMENUON } from "./Loginout";
import storage from "redux-persist/lib/storage/session";
import { WRITING } from "./Write";
import { USERBTN } from "./Usermenu";

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "isLoading",
        "isLoggedIn",
        "userId",
        "userName",
        "userProfile",
        "userInfo",
        "boardId",
        "boardName",
        "writer",
        "content",
        "totalCommentLists",
        "loginMenu",
        "signupMenu",
        "headerMenu",
        "boardLimit",
        "postLimit",
        "uploadedComment",
        "editCommentId",
        "editAnswerId",
        "editAnswerParent",
        "errorWindow",
        "error",
        "subscribe",
        "searchmode"
    ],
};

const initialState = {
    isLoading: false,
    isLoggedIn: false,
    userId: "",
    userName: "",
    userInfo: "",
    userProfile: "",
    writer: "",
    content: "",
    boardId: null,
    boardName: "",
    boardLimit: 0,
    postLimit: 0,
    subscribe: [],
    uploadedComment: false,
    editCommentId: null,
    editAnswerId: null,
    editAnswerParent: null,
    totalCommentLists: [],
    loginMenu: false,
    signupMenu: false,
    headerMenu: false,
    errorWindow: false,
    error: "",
    searchmode: "main",
};

function rootReducer(state = initialState, action) {
    function clearLocalStorageAndCache() {
        localStorage.removeItem("access_token");
        sessionStorage.clear();
    }

    switch (action.type) {
        case LOADING:
            return {
                ...state,
                isLoading: action.payload.isLoading,
            };
        case ERROR_WINDOW_ON:
            return {
                ...state,
                errorWindow: true,
                error: action.payload.error,
            };
        case ERROR_WINDOW_OFF:
            return {
                ...state,
                errorWindow: false,
            };
        case HEADERMENUON:
            return {
                ...state,
                headerMenu: action.payload.headerMenu,
            };
        case LOGINMENUON:
            return {
                ...state,
                loginMenu: true,
                signupMenu: false,
                headerMenu: false,
            };
        case LOGINMENUOFF:
            return {
                ...state,
                loginMenu: false,
                signupMenu: false,
            };
        case SIGNUPMENUON:
            return {
                ...state,
                signupMenu: true,
                loginMenu: false,
                headerMenu: false,
            };
        case SIGNUPMENUOFF:
            return {
                ...state,
                signupMenu: false,
                loginMenu: false,
            };
        case LOGIN:
            // insetSessionId(action.payload.userId);
            return {
                ...state,
                isLoggedIn: true,
                loginMenu: false,
                userId: action.payload.userId,
                userName: action.payload.userName,
                userProfile: action.payload.userProfile,
                userInfo: action.payload.userInfo,
                headerMenu: false,
            };
        case LOGOUT:
            clearLocalStorageAndCache();
            return {
                ...state,
                isLoggedIn: false,
                userId: "",
                userName: "",
                userProfile: "",
                userInfo: "",
            };
        case BOARD_OPENED:
            // boardInfoSave(action.payload.boardId, action.payload.boardName);
            return {
                ...state,
                boardId: action.payload.boardId,
                boardName: action.payload.boardName,
                userId: action.payload.userId,
            };
        case BOARD_SUBSCRIBE:
            return {
                ...state,
                subscribe: action.payload.subscribe,
            };
        case BOARD_LIMIT:
            return {
                ...state,
                boardLimit: action.payload.boardLimit,
                postLimit: action.payload.postLimit,
            };
        case READ:
            return {
                ...state,
                writer: action.payload.writer,
                content: action.payload.content,
            };
        case WRITING:
            return {
                ...state,
                content: action.payload.content,
            };
        case COMMENT_LIST:
            return {
                ...state,
                totalCommentLists: action.payload.totalCommentLists,
            };

        case UPLOAD_COMMENT:
            return {
                ...state,
                uploadedComment: true,
                editCommentId: null,
                editAnswerId: null,
            };
        case EDIT_COMMENT:
            return {
                ...state,
                editCommentId: action.payload.editCommentId,
            };
        case EDIT_ANSWER:
            return {
                ...state,
                editAnswerId: action.payload.editAnswerId,
                editAnswerParent: action.payload.editAnswerParent,
            };
        case UPLOADED_COMMENT:
            return {
                ...state,
                uploadedComment: false,
                editCommentId: null,
                editAnswerId: null,
            };
        case USERBTN:
            return {
                ...state,
                searchmode: action.payload.type,
            };

        default:
            return state;
    }
}

export default persistReducer(persistConfig, rootReducer);
