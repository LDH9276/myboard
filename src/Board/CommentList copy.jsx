import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from '@ckeditor/ckeditor5-custom';
import WriteComment from './WriteComment';
import { editAnswer } from '../Redux/UploadComment';
import CommnetChild from './CommnetChild';

function CommentList({ id }) {
  const [commentList, setCommentList] = useState([]);
  const uploadedComment = useSelector(state => state.uploadedComment);
  const editCommentId = useSelector(state => state.editCommentId);
  const editAnswerId = useSelector(state => state.editAnswerId);
  const editAnswerParent = useSelector(state => state.editAnswerParent);
  const userId = useSelector(state => state.userId);
  const dispatch = useDispatch();

  // Link
  const contentChek = "http://localhost/myboard_server/Board/Post_ReadComment.php";
  const postCommentLink = "http://localhost/myboard_server/Board/Post_WriteComment.php";

  useEffect(() => {
    readContent();
  }, []);

  useEffect(() => {
    readContent();
  }, [uploadedComment]);
  

  const readContent = async () => {
    try {
      const response = await axios.get(`${contentChek}?id=${id}`);
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });

      const parentComments = [];
      const firstDepthComments = [];
      const secondDepthComments = [];

      list.forEach(item => {
        if (item.comment_parent === null) {
          parentComments.push(item);
        } else if (item.comment_depth === 1) {
          firstDepthComments.push(item);
        } else {
          secondDepthComments.push(item);
        }
      });

      parentComments.forEach(parent => {
        parent.children = firstDepthComments.filter(child => child.comment_parent === parent.id);
        parent.children.forEach(child => {
          child.children = secondDepthComments.filter(grandChild => grandChild.comment_parent === child.comment_parent);
        });
      });

      const hierarchicalComments = parentComments;


      setCommentList(hierarchicalComments);

      dispatch({ type: 'UPLOADED_COMMENT' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleModify = (id) => {
    dispatch({ type: 'EDIT_COMMENT', payload: { editCommentId: id } });
  }

  const handleDelete = (id) => {
    const shouldDelete = window.confirm('정말 삭제하시겠습니까?');
    if (shouldDelete) {
      const formdata = new FormData();
      formdata.append('id', id);
      formdata.append('delete', true);

      axios.post(postCommentLink, formdata)
        .then((response) => {
          console.log(response.data);
          readContent();
        })
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch({ type: 'UPLOADED_COMMENT', payload: { editCommentId: id } });
  }

  const handelAnswer = (parent, id) => {
    dispatch(editAnswer(parent, id));
  }


  return (
    <div>
      <ul className='firstchild-comment'>
      {Array.isArray(commentList) &&
          commentList.map(child => (
        <li key={child.id}>
          {editCommentId !== child.id ? (
            <div className='comment-content'>
              <div className="comment-left-wrap">
                <div className="comment-img-wrap">

                </div>
                <div className="comment-top">
                  <p className='comment-item-writer'>{child.writer}</p>
                  <p className='comment-item-regdate'>{child.reg_date}</p>
                </div>
                <div className='comment-btn-wrap'>
                  {userId !== '' ? (
                    <button onClick={() => handelAnswer(child.id, child.id)} className='comment-reply-btn'>답글</button>
                  ) : ''}
                  <button onClick={() => handleModify(child.id)} className='comment-mod-btn'>수정</button>
                  <button onClick={() => handleDelete(child.id)}className='comment-mod-btn'>삭제</button>
                </div>
              </div>
              <div className="comment-right-wrap">
                  <CKEditor 
                    editor={CustomEditor} 
                    data={child.content} 
                    disabled={true}
                    config={{
                      toolbar: [],
                    }}
                    readOnly={true}
                  />
              </div>
            </div>) : (
            <div className='comment-content modify'>
              <WriteComment id={child.id} modify={true} commentId={child.id} content={child.content} />
            </div>
          )}

          <div className="comment-answer-wrap">
            {userId !== '' && editAnswerParent === child.id && editAnswerId  === child.id ? (
                <WriteComment commentId={child.id} answer={true} modify={false} id = {id} depth={child.comment_depth}/>
            ) : ''}
          </div>
          <ul>
            <CommnetChild 
            commentId={child.id}
            children={child.children}
            id={id}
            handleModify={handleModify}
            handleDelete={handleDelete}
            handelAnswer={handelAnswer}
            />
          </ul>
        </li>))}
    </ul>
    </div>
  );
}

export default CommentList;