export const BOARD_OPENED = 'BOARD_OPENED';

export function boardOppend(boardId, userId) {
  return {
    type: BOARD_OPENED,
    payload: {
      boardId: boardId,
      userId: userId
      }
  };
}