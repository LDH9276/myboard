import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "@ckeditor/ckeditor5-custom";
import WriteComment from "./WriteComment";
import { editAnswer, uploadComment, editComment, refreshComment } from "../Redux/UploadComment";
import CommnetChild from "./CommnetChild";
import "./css/comment.css";


function CommentList({ id, userId }) {
  const uploadedComment = useSelector((state) => state.uploadedComment);
  const editCommentId = useSelector((state) => state.editCommentId);
  const editAnswerId = useSelector((state) => state.editAnswerId);
  const editAnswerParent = useSelector((state) => state.editAnswerParent);
  const [likeClickTime, setLikeClickTime] = useState("");
  const [likeStatus, setLikeStatus] = useState({});
  const [totalLikes, setTotalLikes] = useState({});
  const totalCommentLists = useSelector((state) => state.totalCommentLists);
  const [filteredCommentList, setFilteredCommentList] = useState([]);
  const dispatch = useDispatch();

  // Link
  const contentChek =
    "http://localhost/myboard_server/Board/Post_ReadComment.php";
  const postCommentLink =
    "http://localhost/myboard_server/Board/Post_WriteComment.php";
  const postLikeLink =
    "http://localhost/myboard_server/Board/Post_CommentLike.php";

  useEffect(() => {
    if (Array.isArray(totalCommentLists)) {
      return;
    } else {
      readContent();
    }
  }, []);

  useEffect(() => {
    readContent();
  }, [likeStatus]);

  useEffect(() => {
    readContent();
  }, [uploadedComment]);

  const readContent = async () => {
    try {
      const formData = new FormData();
      formData.append("post_id", id);
      formData.append("user_id", userId);

      const response = await axios.post(contentChek, formData);
      const list = response.data.list.map((item) => {
        item.content = item.content.replace(/\\/g, "");
        return item;
      });

      const parentComments = [];
      const firstDepthComments = [];
      const secondDepthComments = [];

      list.forEach((item) => {
        if (item.comment_parent === null) {
          parentComments.push(item);
        } else if (item.comment_depth === 1) {
          firstDepthComments.push(item);
        } else {
          secondDepthComments.push(item);
        }
      });

      parentComments.forEach((parent) => {
        parent.children = firstDepthComments.filter(
          (child) => child.comment_parent === parent.id
        );
        parent.children.forEach((child) => {
          child.children = secondDepthComments.filter(
            (grandChild) => grandChild.comment_parent === child.id
          );
        });
      });

      const hierarchicalComments = parentComments;

      setFilteredCommentList(hierarchicalComments);
      dispatch(refreshComment());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intId = parseInt(id);
    if (!Array.isArray(totalCommentLists)) {
      return;
    } else {
      const filteredList = totalCommentLists.filter(
        (item) => item.post_id === intId
      );
      setFilteredCommentList(filteredList);
    }
  }, [id, totalCommentLists]);

  const handleModify = (id) => {
    dispatch({ type: "EDIT_COMMENT", payload: { editCommentId: id } });
  };

  const handleDelete = (id) => {
    const shouldDelete = window.confirm("정말 삭제하시겠습니까?");
    if (shouldDelete) {
      const formdata = new FormData();
      formdata.append("id", id);
      formdata.append("delete", true);

      axios
        .post(postCommentLink, formdata)
        .then((response) => {
          readContent();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch({ type: "UPLOADED_COMMENT" });
  };

  const handelAnswer = (parent, id) => {
    dispatch(editAnswer(parent, id));
  };

  const handleLikeAction = useCallback( // useCallback을 사용하여 렌더링 최적화
    (commentId, commentLike) => { // commentLike는 현재 댓글의 좋아요 상태
      if (userId === "") { // 로그인이 되어있지 않다면 실행하지 않음
        return;
      }

      // 이전 함수가 실행된지 3초 이내라면 실행하지 않음
      const now = new Date();
      if (now - likeClickTime < 1500) {
        return;
      } else {
        if(commentLike){ // 현재 댓글의 좋아요 상태가 true라면
          const formdata = new FormData();
          formdata.append("post_id", id);
          formdata.append("comment_id", commentId);
          formdata.append("user_id", userId); // 현재 로그인한 유저의 아이디
          formdata.append("like", false);
          axios.post (postLikeLink, formdata)
          .then((response) => {
            readContent();
          })
          .catch((error) => {
            console.log(error);
          });
        } else {
          const formdata = new FormData();
          formdata.append("comment_id", commentId);
          formdata.append("user_id", userId);
          formdata.append("like", true);
          axios.post (postLikeLink, formdata)
          .then((response) => {
            readContent();
          })
          .catch((error) => {
            console.log(error);
          });
        }
      }
    },
    [id, likeClickTime, userId]
  );

  return (
    <div>
      <ul className="firstchild-comment">
        {Array.isArray(filteredCommentList) &&
          filteredCommentList.map((child) => (
            <li key={child.id}>
              {userId === 'Admin' ? (
                <div className="comment-checkbox-wrap">
                  <button className=".board-delete-chkbox" onClick={() => handleDelete(child.id)}>&nbsp;</button>
                </div>
              ) : ''}

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
                        <button
                          onClick={() => handelAnswer(child.id, child.id)}
                          className="comment-reply-btn"
                        >
                          답글
                        </button>
                        {userId === child.writer ? (
                          <div className="comment-modbtn-wrap">
                            <button
                              onClick={() => handleModify(child.id)}
                              className="comment-mod-btn"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => handleDelete(child.id)}
                              className="comment-mod-btn"
                            >
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
                    {userId !== "" && editCommentId === child.id ? (
                      <WriteComment
                        commentId={child.id}
                        answer={false}
                        modify={true}
                        id={id}
                        depth={child.comment_depth}
                      />
                    ) : (
                      <CKEditor
                        editor={CustomEditor}
                        data={child.content}
                        disabled={true}
                        config={{
                          toolbar: [],
                        }}
                        readOnly={true}
                      />
                    )}
                  </div>
                  {child.writer === userId ? (
                  <div className="comment-like-wrap">
                      <span className="comment-like-icon_wrap">
                      <img
                        src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`}
                        alt="댓글수"
                        className="comment-item-back"
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/btn/like.svg`}
                        alt="댓글수"
                        className='comment-item-icon active'
                      />
                    </span>
                    <span className="comment-like-count">
                      {child.total_like}
                    </span>
                  </div>) : (
                  <div className="comment-like-wrap"  onClick={() => handleLikeAction(child.id, child.like)}>
                    <span className="comment-like-icon_wrap">
                      <img
                        src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`}
                        alt="댓글수"
                        className="comment-item-back"
                      />
                      <img
                        src={`${process.env.PUBLIC_URL}/btn/like.svg`}
                        alt="댓글수"
                        className={
                          child.like ? "comment-item-icon active" : "comment-item-icon"
                        }
                      />
                    </span>
                    <span className="comment-like-count">
                      {child.total_like}
                    </span>
                  </div>)}
              </div>
              ) : (
                <div className="comment-content modify">삭제된 댓글입니다.</div>
              )}

              <div className="comment-answer-wrap">
                {userId !== "" &&
                editAnswerParent === child.id &&
                editAnswerId === child.id ? (
                  <WriteComment
                    commentId={child.id}
                    answer={true}
                    modify={false}
                    id={id}
                    depth={child.comment_depth}
                  />
                ) : (
                  ""
                )}
              </div>

              <ul>
                <CommnetChild
                  userId={userId}
                  commentId={child.id}
                  children={child.children}
                  id={id}
                  parentWriter={child.writer}
                  handleModify={handleModify}
                  handleDelete={handleDelete}
                  handelAnswer={handelAnswer}
                  handleLikeAction={handleLikeAction}
                />
              </ul>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default CommentList;
