export const UPLOAD_COMMENT = 'UPLOAD_COMMENT';
export const EDIT_COMMENT = 'EDIT_COMMENT';
export const UPLOADED_COMMENT = 'UPLOADED_COMMENT';
export const EDIT_ANSWER = 'EDIT_ANSWER';

export function uploadComment() {
    return {
        type: UPLOAD_COMMENT,
        payload: {
            uploadedComment: true
        }
    };
}

export function editComment(id) {
    return {
        type: EDIT_COMMENT,
        payload: {
            editCommentId: id
        }
    };
}

export function editAnswer(parent, id) {
    return {
        type: EDIT_ANSWER,
        payload: {
            editAnswerId: id,
            editAnswerParent: parent
        }
    };
}

export function refreshComment() {
    return {
        type: UPLOADED_COMMENT,
        payload: {
            uploadedComment: false,
        }
    };
}