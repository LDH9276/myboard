import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './css/read.css';


function Read({userId}) {
  
  const { id } = useParams();
  const contentChek = "http://localhost/myboard_server/Board/Post_Read.php"
  const [content, setContent] = useState([]);
  const [writer, setWriter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    readContent();
  }, []);

  const readContent = async () => {
    try {
      const response = await axios.get(`${contentChek}?id=${id}`);;
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });
      setContent(list);
      setWriter(list[0].writer);
    } catch (error) {
      console.error(error);
    }
  };

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
    axios.post('http://localhost/JTW_testing/Board/Post_Write.php', formData)
    .then((res) => {
      console.log(res.data);
      alert('삭제 완료');
      navigate('/');
    })
    .catch((err) => {
      console.error(err);
      alert('삭제 실패');
    });
  };

  return (
    <div>
      <ul>
        {Array.isArray(content) && content.map(item => (
          <li key={item.id}>
            <p>ID: {item.id}</p>
            <p>Title: {item.title}</p>
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
    </div>
  );
}

export default Read;