export const BOARD_OPENED = 'BOARD_OPENED';
export const BOARD_SUBSCRIBE = 'BOARD_SUBSCRIBE';
export const BOARD_LIMIT = 'BOARD_LIMIT';

export function boardOppend(boardId, boardName, userId) {
  return {
    type: BOARD_OPENED,
    payload: {
      boardId: boardId,
      boardName: boardName,
      userId: userId
      }
  };
}

export function boardLimit(boardLimit, postLimit) {
  return {
    type: BOARD_LIMIT,
    payload: {
      boardLimit: boardLimit,
      postLimit: postLimit
    }
  };
}

export function boardSubscribe(boardList) {
  return {
    type: BOARD_SUBSCRIBE,
    payload: {
      subscribe : boardList
    }
  };
}