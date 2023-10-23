import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { formats, toolbarOptions } from "./boardmodules/Module";
import "./css/write.css";
import { errorWindowOn } from "../Redux/Error";
import { sendTwitterLink } from "../API/sendTwitterLink";
Quill.register("modules/imageResize", ImageResize);

function Write({ userId, userName }) {
    // State, Props
    const { id } = useParams();
    const boardId = useSelector((state) => state.boardId);
    const { mod } = useParams();
    const [content, setContent] = useState("");
    const [modContent, setModContent] = useState("");
    const [title, setTitle] = useState("");
    const [boardCate, setBoardCate] = useState([]);
    const [boardMaster, setBoardMaster] = useState([]);
    const [postCate, setPostCate] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const quillRef = useRef();

    // Link
    const postWriteLink = "http://localhost/myboard_server/Board/Post_Write.php";
    const postRead = "http://localhost/myboard_server/Board/Post_Read.php";
    const imageUploadLink = "http://localhost/myboard_server/Board/Post_Upload.php";
    const boardLink = "http://localhost/myboard_server/Board/Board_ListCheck.php";

    const readBoard = async () => {
        try {
            const formData = new FormData();
            formData.append("id", boardId);

            const response = await axios.post(boardLink, formData);

            const cate = response.data.boardlist[0].board_category;
            cate.shift();

            setBoardCate(cate);
            setBoardMaster(response.data.boardlist[0].board_admin);
        } catch (error) {
            console.error(error);
        }
    };

    async function handleContentChange(value) {
        let filteredValue = value.replace(/<span[^>]*>/g, "");
      
        const url = filteredValue.match(/(https?:\/\/[^\s]+)/g);
        if (url) {
            filteredValue.replace(url[0], url[0] + "<p><br></p>");
        }
            
      
        setContent(filteredValue);
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
                const imageUrl = `http://localhost/myboard_server/Board/Upload/${data.filename}`;

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

    const modules = useMemo(
        () => ({
            toolbar: {
                handlers: {
                    image: handleImageUpload,
                },
                container: toolbarOptions,
            },
            imageResize: {
                parchment: Quill.import("parchment"),
                modules: ["Resize", "DisplaySize", "Toolbar"],
            },
        }),
        []
    );

    const onUpdateClick = () => {
        const formData = new FormData();
        formData.append("writer", userId);
        formData.append("nickname", userName);
        formData.append("content", content);
        formData.append("title", title);
        formData.append("board", boardId);
        formData.append("category", postCate);

        if (title === "") {
            dispatch(errorWindowOn("제목을 입력해주세요"));
            return;
        } else if (content === "") {
            dispatch(errorWindowOn("내용을 입력해주세요"));
            return;
        } else {
            if (mod === "modify") {
                formData.append("id", id);
                formData.append("modify", true);
                axios
                    .post(postWriteLink, formData)
                    .then((res) => {
                        alert("수정 완료");
                        navigate(`/board/${boardId}`);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("수정 실패");
                    });
            } else {
                axios
                    .post(postWriteLink, formData)
                    .then((res) => {
                        console.log(res.data);
                        alert("업로드 완료");
                        navigate(`/board/${boardId}`);
                    })
                    .catch((err) => {
                        console.error(err);
                        alert("업로드 실패");
                    });
            }
        }
    };

    const updateContent = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("mod", true);

            const response = await axios.post(postRead, formData);
            const list = response.data.list.map((item) => {
                item.content = item.content.replace(/\\/g, "");
                return item;
            });
            setModContent(list[0].content);
            setTitle(list[0].title);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        readBoard();
        if (mod === "modify") {
            updateContent();
        }
    }, []);

    useEffect(() => {
        console.log(boardMaster);
    }, [boardMaster]);

    return (
        <div className="w-full max-w-[800px] bg-base-200  mx-auto post-write">
            <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className="write-title-input" placeholder="제목을 입력해주세요" />

            <div>
                <ul className="board-module-category">
                    {boardMaster.includes(userId) && (
                        <li className={postCate === 0 ? "board-category-btn active" : "board-category-btn "}>
                            <button onClick={() => setPostCate(0)}>공지</button>
                        </li>
                    )}
                    {boardCate.map((category, index) => (
                        <li key={index} className={postCate === index + 1 ? "board-category-btn active" : "board-category-btn "}>
                            <button onClick={() => setPostCate(index + 1)}>{category}</button>
                        </li>
                    ))}
                </ul>
            </div>

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
