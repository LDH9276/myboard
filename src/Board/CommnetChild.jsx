import React from 'react';
import { useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import WriteComment from './WriteComment';
import CommentGrandChild from './CommentGrandChild';

function CommnetChild({commentId, children, id, handleModify, handleDelete, handelAnswer}) {
  const editAnswerParent = useSelector(state => state.editAnswerParent);
  const editCommentId = useSelector(state => state.editCommentId);
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
                    <button onClick={() => handelAnswer(commentId, child.id)} className='comment-reply-btn'>답글</button>
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
                    editor={ClassicEditor} 
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
                <WriteComment commentId={child.id} answer={true} modify={false} id = {id} depth={child.comment_depth}/>
            ) : ''}
          </div>
          <ul>
            <CommentGrandChild 
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
  );
}

export default CommnetChild;