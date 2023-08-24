export const COMMENT_LIST = 'COMMENT_LIST';

export function totalCommentLists(totalCommentLists) {
  return {
    type: COMMENT_LIST,
    payload: {
      totalCommentLists: totalCommentLists
      }
  };
}