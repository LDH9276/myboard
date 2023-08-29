export const BOARD_OPENED = 'BOARD_OPENED';

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