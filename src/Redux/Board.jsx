export const BOARD_OPENED = 'BOARD_OPENED';

export function boardOppend(boardId, boardName) {
  return {
    type: BOARD_OPENED,
    payload: {
      boardId: boardId,
      boardName: boardName
      }
  };
}