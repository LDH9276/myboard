import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import WriteComment from './WriteComment';

function CommentList({ id }) {
  const [commentList, setCommentList] = useState([]);
  const uploadedComment = useSelector(state => state.uploadedComment);
  const editCommentId = useSelector(state => state.editCommentId);
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
      console.log(id);
      const response = await axios.get(`${contentChek}?id=${id}`);

      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });
      setCommentList(list);
      dispatch({type: 'UPLOADED_COMMENT'});
    } catch (error) {
      console.error(error);
    }
  };

  const handleModify = (id) => {
    dispatch({type: 'EDIT_COMMENT', payload: {editCommentId: id}});
  }

  const handleDelete = (id) => {
      const shouldDelete = window.confirm('정말 삭제하시겠습니까?');
      if(shouldDelete){
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
  
      dispatch({type: 'UPLOADED_COMMENT', payload: {editCommentId: id}});
    }

  return (
    <div>
      <ul>
        {Array.isArray(commentList) &&
            commentList.map(comment => (
                <li key={comment.id}>
                    <p>{comment.writer}</p>
                    <CKEditor
                        editor={ClassicEditor}
                        data={comment.content}
                        disabled={true}
                        config={{
                            toolbar: [],
                        }}
                        readOnly={true}
                    />
                    <p>{comment.reg_date}</p>
                    
                    {comment.writer === userId ? (
                    <p>
                      <button onClick={()=>handleModify(comment.id)}>수정</button>
                      <button onClick={()=>handleDelete(comment.id)}>삭제</button>
                    </p>) : ''}
                    {editCommentId === comment.id ? (
                      <WriteComment id={id} modify={true} commentId={comment.id} content={comment.content}/>
                    ) : ''
                    }
                </li>
                
        ))}
        <li>

        </li>
      </ul>
    </div>
  );
}

export default CommentList;