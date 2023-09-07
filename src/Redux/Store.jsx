import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Reducers";

const initialState = {
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
};

const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,

    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
});

export default store;
