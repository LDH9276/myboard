import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Write({userId}) {

  const { id } = useParams();
  const { mod } = useParams();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
  const [flag, setFlag] = useState(false);
  const imgLink = "http://localhost/myboard_server/Board/Upload"
  const navigate = useNavigate();

  const customUploadAdapter = (loader) => {
    return {
      async upload() {
        const data = new FormData();
        const file = await loader.file;
        data.append("name", file.name);
        data.append("file", file);
        try {
          const res = await axios.post(
            "http://localhost/myboard_server/Board/Post_Upload.php",
            data
          );
          if (!flag) {
            setFlag(true);
            setImage(res.data.filename);
          }
          return { default: `${imgLink}/${res.data.filename}` };
        } catch (err) {
          throw err;
        }
      },
    };
  };

  function uploadPlugin (editor){ // (3)
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return customUploadAdapter(loader);
    }
  }

  const onUpdateClick = () => {
    const formData = new FormData();
    formData.append('writer', userId);
    formData.append('content', content);
    formData.append('reg_date', new Date());
    formData.append('title', title);

    if(mod === 'modify'){
      formData.append('id', id);
      formData.append('modify', true);
      axios.post('http://localhost/myboard_server/Board/Post_Write.php', formData)
      .then((res) => {
        alert('수정 완료');
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        alert('수정 실패');
      });
    } else {
    axios.post('http://localhost/myboard_server/Board/Post_Write.php', formData)
      .then((res) => {
        alert('업로드 완료');
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        alert('업로드 실패');
      });
    };
  };

  const updateContent = async () => {
    try {
      const response = await axios.get(`http://localhost/myboard_server/Board/Post_Read.php?id=${id}`);;
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });
      setContent(list[0].content);
      setTitle(list[0].title);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(mod === 'modify'){
      updateContent();
    }
  }, []);

    


  return (
    <div>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title}/>

      <CKEditor
        editor={ClassicEditor}
        config={{
          extraPlugins: [uploadPlugin]
        }}
        data={content}
        onChange={(event, editor) => {
          const data = editor.getData();
          setContent(data);
        }}
      />
      <button onClick={() => onUpdateClick()}>업로드</button>
    </div>
  );
}

export default Write;