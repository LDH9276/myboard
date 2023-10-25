import React from "react";
import { useSelector } from "react-redux";
import { Tweet } from "react-twitter-widgets";
import WriteComment from "./WriteComment";
import CommentGrandChild from "./CommentGrandChild";

function CommnetChild({ commentId, children, id, handleModify, handleDelete, handelAnswer, handleLikeAction, userId, parentWriter }) {
    const editAnswerParent = useSelector((state) => state.editAnswerParent);
    const editCommentId = useSelector((state) => state.editCommentId);
    const editAnswerId = useSelector((state) => state.editAnswerId);

    return (
        <ul>
            {children.map((child) => (
                        <li key={child.id} className="secondchild-comment">
                        {userId === "Admin" ? (
                            <div className="comment-checkbox-wrap">
                                <button className=".board-delete-chkbox" onClick={() => handleDelete(child.id)}>
                                    &nbsp;
                                </button>
                            </div>
                        ) : (
                            ""
                        )}

                        {child.is_deleted !== 1 ? (
                            <div className="comment-content">
                                <div className="comment-left-wrap">
                                    <div className="comment-img-wrap">
                                        <img
                                            src={`http://localhost/myboard_server/Users/Profile/${child.profile_name}.${child.profile_ext}`}
                                            alt="profile"
                                            className="comment-profile-img"
                                        />
                                    </div>
                                </div>
                                <div className="comment-content-wrap">
                                    <div className="comment-top">
                                        <div className="comment-writer-wrap">
                                            <p className="comment-item-writer">
                                                <span className="comment-item-parent_writer">@{parentWriter}</span>
                                                {child.writer}
                                                </p>
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
                                        <p className="comment-item-regdate">{child.reg_date}</p>
                                    </div>
                                    {userId !== "" && editCommentId === child.id ? (
                                        <WriteComment commentId={child.id} answer={false} modify={true} id={id} depth={child.comment_depth} />
                                    ) : (
                                        <div className="">
                                            <div dangerouslySetInnerHTML={{ __html: child.content }}></div>
                                        </div>
                                    )}
                                    <div className="commonet-state-wrap">
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
                                                <button onClick={() => handelAnswer(child.id, child.id)} className="comment-reply-btn">
                                                    답글
                                                </button>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="comment-content modify">삭제된 댓글입니다.</div>
                        )}

                        <div className="comment-answer-wrap">
                            {userId !== "" && editAnswerParent === child.id && editAnswerId === child.id ? (
                                <WriteComment commentId={child.id} answer={true} modify={false} id={id} depth={child.comment_depth} />
                            ) : (
                                ""
                            )}
                        </div>
                    <ul>
                        <CommentGrandChild
                            userId={userId}
                            commentId={child.id}
                            children={child.children}
                            parentWriter={child.writer}
                            id={id}
                            handleModify={handleModify}
                            handleDelete={handleDelete}
                            handelAnswer={handelAnswer}
                            handleLikeAction={handleLikeAction}
                        />
                    </ul>
                </li>
            ))}
        </ul>
    );
}

export default CommnetChild;
