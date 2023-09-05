import React from "react";

function CommentItem(props) {
    return (
        <ul className={`${children}comment`}>
            {children.map((child) => (
                <li key={child.id}>
                    {child.is_deleted !== 1 ? (
                        <div className="comment-content">
                            <div className="comment-left-wrap">
                                <div className="comment-img-wrap"></div>
                                <div className="comment-top">
                                    <p className="comment-item-writer">{child.writer}</p>
                                    <p className="comment-item-regdate">{child.reg_date}</p>
                                </div>
                                {userId !== "" ? (
                                    <div className="comment-btn-wrap">
                                        {userId === child.writer ? (
                                            <div className="comment-modbtn-wrap">
                                                <button onClick={() => handleModify(child.id)} className="comment-mod-btn">
                                                    수정
                                                </button>
                                                <button onClick={() => handleDelete(child.id)} className="comment-mod-btn">
                                                    삭제
                                                </button>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div className="comment-content-wrap">
                                <p>@{parentWriter}</p>
                                {userId !== "" && editCommentId === child.id ? (
                                    <WriteComment commentId={child.id} answer={false} modify={true} id={id} depth={child.comment_depth} />
                                ) : (
                                    <div dangerouslySetInnerHTML={{ __html: child.content }}></div>
                                )}
                            </div>
                            {child.writer === userId ? (
                                <div className="comment-like-wrap">
                                    <span className="comment-like-icon_wrap">
                                        <img src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`} alt="댓글수" className="comment-item-back" />
                                        <img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt="댓글수" className="comment-item-icon active" />
                                    </span>
                                    <span className="comment-like-count">{child.total_like}</span>
                                </div>
                            ) : (
                                <div className="comment-like-wrap" onClick={() => handleLikeAction(child.id, child.like)}>
                                    <span className="comment-like-icon_wrap">
                                        <img src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`} alt="댓글수" className="comment-item-back" />
                                        <img
                                            src={`${process.env.PUBLIC_URL}/btn/like.svg`}
                                            alt="댓글수"
                                            className={child.like ? "comment-item-icon active" : "comment-item-icon"}
                                        />
                                    </span>
                                    <span className="comment-like-count">{child.total_like}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="comment-content modify">삭제된 댓글입니다.</div>
                    )}

                    <div className="comment-answer-wrap">
                        {userId !== "" && editAnswerParent === commentId && editAnswerId === child.id ? (
                            <WriteComment commentId={commentId} answer={true} modify={false} id={id} depth={1} />
                        ) : (
                            ""
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default CommentItem;
