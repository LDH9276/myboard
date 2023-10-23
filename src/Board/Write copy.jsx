import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "@ckeditor/ckeditor5-custom/";
import "./css/write.css";
import PostWrite from "./PostWrite";

function Write({ userId, userName }) {
    // State, Props
    const { id } = useParams();
    const boardId = useSelector((state) => state.boardId);
    const { mod } = useParams();
    const [content, setContent] = useState("");
    const [modContent, setModContent] = useState("");
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [flag, setFlag] = useState(false);

    // Link
    const imgLink = "http://localhost/myboard_server/Upload";
    const postUploadLink = "http://localhost/myboard_server/Post_Upload.php";
    const postWriteLink = "http://localhost/myboard_server/Post_Write.php";
    const postRead = "http://localhost/myboard_server/Post_Read.php";

    const navigate = useNavigate();

    const customUploadAdapter = (loader) => {
        return {
            async upload() {
                const data = new FormData();
                const file = await loader.file;
                data.append("name", file.name);
                data.append("file", file);
                try {
                    const res = await axios.post(postUploadLink, data);
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

    function uploadPlugin(editor) {
        // (3)
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        };
    }

    const onUpdateClick = () => {
        const formData = new FormData();
        formData.append("writer", userId);
        formData.append("nickname", userName);
        formData.append("content", content);
        formData.append("title", title);
        formData.append("board", boardId);

        console.log(formData);

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
    };

    const updateContent = async () => {
        try {
            const response = await axios.get(`${postRead}?id=${id}`);
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
        if (mod === "modify") {
            updateContent();
        }
    }, []);

    return (
        <div className="w-full max-w-[800px] bg-base-200  mx-auto post-write">
            <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className="write-title-input" placeholder="제목을 입력해주세요" />

            <PostWrite modContent={modContent} />

            <div className="write-btn-wrap">
                <button onClick={() => navigate("/")}>작성취소</button>
                <button onClick={() => onUpdateClick()}>업로드</button>
            </div>
        </div>
    );
}

export default Write;
