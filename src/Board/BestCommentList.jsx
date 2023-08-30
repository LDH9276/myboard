import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from '@ckeditor/ckeditor5-custom';

function BestCommentList({id}) {

  const bestCommentLink = "http://localhost/myboard_server/Board/Post_BestCommentList.php";

  const [bestComment, setBestComment] = useState([]);

  const readBesetComment = async () => {
    try {
      const formdata = new FormData();
      formdata.append('id', id);
      const response = await axios.post(bestCommentLink, formdata);
      setBestComment(response.data.list);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    readBesetComment();
  }, [id]);

  return (
    <div>
      {bestComment.length > 0 ? (
      <div className='comment-best-area'>
      {Array.isArray(bestComment) && bestComment.map((comment, index) => (
        <div key={index} className='comment-best-wrap'>
          <div className='comment-best-writer'>{comment.writer}</div>
          <div className='comment-best-content'>
            <CKEditor
              editor={CustomEditor}
              data={comment.content}
              disabled={true}
              config={{
                toolbar: [],
              }}
              readOnly={true}
            />
          </div>
          <div className='comment-best-icon'>
            <img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt="like" className='comment-best-icon-img'/>
            <span>{comment.total_like}</span>
          </div>
        </div>
      ))}
      </div>) : ''}
    </div>
  );
}

export default BestCommentList;