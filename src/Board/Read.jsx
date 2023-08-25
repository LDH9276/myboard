import React, { useEffect, useTransition } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useSelector, useDispatch } from 'react-redux';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import WriteComment from './WriteComment';
import './css/read.css';
import CommentList from './CommentList';

function Read({userId}) {
  
  const { id } = useParams();
  const content = useSelector(state => state.content);
  const writer = useSelector(state => state.writer);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Link
  const postWriteLink = "http://localhost/myboard_server/Board/Post_Write.php"
  const contentChek = "http://localhost/myboard_server/Board/Post_Read.php"

  const readContent = async () => {
    try {
      const response = await axios.get(`${contentChek}?id=${id}`);;
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });
      dispatch({type: 'READ', payload: {writer : list[0].writer, content: list}});
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    startTransition(() => {
      readContent();
    });
  }, []);

  const onDleteBtnClick = () => {
    if(window.confirm('정말로 삭제하시겠습니까?')){
      deletePost();
    } else {
      return;
    }
  };

  const deletePost = async () => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('delete', true);
    axios.post(postWriteLink, formData)
    .then((res) => {
      alert('삭제 완료');
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
      alert('삭제 실패');
    });
  };

  return (
    <div className='board-container'>
      <ul>
        {Array.isArray(content) && content.map(item => (
          <li key={item.id}>
            <p>ID: {item.id}</p>
            <p>Title: {item.title}</p>
            <p>Writer: {item.writer}</p>
            <div className="read">
              <CKEditor
                editor={ClassicEditor}
                data={item.content}
                readOnly={true}
                toolbar={[]}
                disabled={true}
              />
            </div>
          
          </li>
        ))}
      </ul>

      <button onClick={() => navigate('/write')}>글쓰기</button>
      {writer === userId ? (
        <>
          <button onClick={() => navigate(`/write/${id}/modify`)}>수정</button>
          <button onClick={onDleteBtnClick}>삭제</button>
        </>
      ) : null}

      <button onClick={() => navigate('/')}>목록으로</button>

      <div className="comment">
        {isPending ? (
          <p>Loading...</p>
        ) : (
          <CommentList id={id} />
        )}
        <WriteComment id={id}/>
      </div>
    </div>
  );
}

export default Read;