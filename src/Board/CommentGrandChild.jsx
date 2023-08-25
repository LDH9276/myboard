import React from 'react';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from '@ckeditor/ckeditor5-custom';
import WriteComment from './WriteComment';

function CommentGrandChild({ commentId, children, id, handleModify, handleDelete, handelAnswer }) {
  const editCommentId = useSelector(state => state.editCommentId);
  const editAnswerParent = useSelector(state => state.editAnswerParent);
  const editAnswerId = useSelector(state => state.editAnswerId);
  const userId = useSelector(state => state.userId);


  return (
    <ul className='firstchild-comment'>
      {children.map(child => (

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
                {userId !== '' ? (
                    <div className='comment-btn-wrap'>
                      <button button onClick={() => handelAnswer(commentId, child.id)} className='comment-reply-btn'>답글</button>
                      {userId === child.writer ? (
                      <div className='comment-modbtn-wrap'>
                        <button onClick={() => handleModify(child.id)} className='comment-mod-btn'>수정</button>
                        <button onClick={() => handleDelete(child.id)} className='comment-mod-btn'>삭제</button>
                      </div>
                    ) : ''}
                    </div>
                  ) : ''}
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
            {userId !== '' && editAnswerParent === commentId && editAnswerId  === child.id ? (
                <WriteComment commentId={commentId} answer={true} modify={false} id = {id} depth={1}/>
            ) : ''}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default CommentGrandChild;