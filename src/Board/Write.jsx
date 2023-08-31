import React, {useEffect, useState, useRef, useMemo} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactQuill, {Quill} from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { formats, toolbarOptions } from "./boardmodules/Module";
import './css/write.css'

function Write({userId, userName}) {

  // State, Props
  const { id } = useParams();
  const boardId = useSelector(state => state.boardId);
  const { mod } = useParams();
  const [content, setContent] = useState('');
  const [modContent, setModContent] = useState('');
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef();

  // Link
  const postWriteLink = "http://localhost/myboard_server/Board/Post_Write.php"
  const postRead = "http://localhost/myboard_server/Board/Post_Read.php"
  const imageUploadLink = "http://localhost/myboard_server/Board/Post_Upload.php"

  // Quill
  Quill.register("modules/imageResize", ImageResize);


  function handleContentChange(value) {
    setContent(value);
  }

  useEffect(() => {
    setContent(modContent);
  }, [modContent]);

  function handleImageUpload() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch(imageUploadLink, {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
  
        const data = await response.json();
        const imageUrl = `http://localhost/myboard_server/Upload/${data.filename}`;
  
        // 이미지를 에디터에 삽입
        const range = quillRef.current.getEditor().getSelection();
        if (range) {
          quillRef.current.getEditor().insertEmbed(range.index, "image", imageUrl);
        } else {
          quillRef.current.getEditor().insertEmbed(0, "image", imageUrl);
        }
      } catch (error) {
        console.error("Error uploading image", error);
      }
    };
  }

  const modules = useMemo(() => ({
  toolbar: {
      handlers: {
      image: handleImageUpload,
      },
      container: toolbarOptions,
  },
  imageResize: {
      parchment: Quill.import("parchment"),
      modules: ["Resize", "DisplaySize", "Toolbar"],
  }}), []);

  const onUpdateClick = () => {
    const formData = new FormData();
    formData.append('writer', userId);
    formData.append('nickname', userName);
    formData.append('content', content);
    formData.append('title', title);
    formData.append('board', boardId);

    if(mod === 'modify'){
      formData.append('id', id);
      formData.append('modify', true);
      axios.post(postWriteLink, formData)
      .then((res) => {
        alert('수정 완료');
        navigate(`/board/${boardId}`);
      })
      .catch((err) => {
        console.error(err);
        alert('수정 실패');
      });
    } else {
    axios.post(postWriteLink, formData)
      .then((res) => {
        console.log(res.data);
        alert('업로드 완료');
        navigate(`/board/${boardId}`);
      })
      .catch((err) => {
        console.error(err);
        alert('업로드 실패');
      });
    };
  };

  const updateContent = async () => {
    try {
      const response = await axios.get(`${postRead}?id=${id}`);;
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });
      setModContent(list[0].content);
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
    <div className='board-container post-write'>
      <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className='write-title-input' placeholder='제목을 입력해주세요'/>

      <ReactQuill
            ref={quillRef}
            onChange={handleContentChange}
            placeholder={"내용을 입력해주세요"}
            theme="snow" 
            modules={modules}
            formats={formats}
            value={content}
      ></ReactQuill>

      <div className="write-btn-wrap">
          <div className="write-btn-wrap">
            <button onClick={() => navigate(`/board/${boardId}`)}>작성취소</button>
            <button onClick={onUpdateClick}>작성완료</button>
          </div>
      </div>

    </div>
  );
}

export default Write;