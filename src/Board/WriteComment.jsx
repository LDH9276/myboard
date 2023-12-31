import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { formats, commentToolbarOptions } from "./boardmodules/Module";
import { useSelector, useDispatch } from "react-redux";
import { errorWindowOn } from "../Redux/Error";
Quill.register("modules/imageResize", ImageResize);

function WriteComment({ id, commentId, modify, answer, depth }) {
    // State, Props
    const uploadedComment = useSelector((state) => state.uploadedComment);
    const [content, setContent] = useState("");
    const userId = useSelector((state) => state.userId);
    const userName = useSelector((state) => state.userName);
    const userProfile = useSelector((state) => state.userProfile);
    const dispatch = useDispatch();
    const commentQuillRef = useRef();

    // Link
    const imageUploadLink = "http://localhost/myboard_server/Board/Post_Upload.php";
    const postCommentLink = "http://localhost/myboard_server/Board/Post_WriteComment.php";
    const postCommentRead = "http://localhost/myboard_server/Board/Post_ReWriteComment.php";

    function handleContentChange(value) {
        const filteredValue = value.replace(/<span[^>]*>/g, "");
        setContent(filteredValue);
    }

    useEffect(() => {
        setContent("");
    }, [modify]);

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
                const range = commentQuillRef.current.getEditor().getSelection();
                if (range) {
                    commentQuillRef.current.getEditor().insertEmbed(range.index, "image", imageUrl);
                } else {
                    commentQuillRef.current.getEditor().insertEmbed(0, "image", imageUrl);
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
                container: commentToolbarOptions,
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
        formData.append("content", content);
        formData.append("post_id", id);
        formData.append("reg_date", new Date());

        if (content === "") {
            dispatch(errorWindowOn("댓글 내용을 입력해주세요"));
            return;
        }

        if (modify) {
            formData.append("id", commentId);
            formData.append("content", content);
            formData.append("modify", true);
            axios
                .post(postCommentLink, formData)
                .then((res) => {
                    console.log(res.data);
                    dispatch({ type: "UPLOAD_COMMENT", payload: uploadedComment });
                    setContent("");
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (!modify && answer) {
            formData.append("post_id", id);
            formData.append("comment_id", commentId);
            formData.append("content", content);
            formData.append("answer", true);
            formData.append("depth", depth);
            axios
                .post(postCommentLink, formData)
                .then((res) => {
                    console.log(res.data);
                    dispatch({ type: "UPLOAD_COMMENT", payload: uploadedComment });
                    setContent("");
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            axios
                .post(postCommentLink, formData)
                .then((res) => {
                    console.log(res.data);
                    dispatch({ type: "UPLOAD_COMMENT", payload: uploadedComment });
                    setContent("");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const updateContent = async () => {
        try {
            console.log(commentId);
            console.log(`${postCommentRead}?id=${commentId}`);
            const response = await axios.get(`${postCommentRead}?id=${commentId}`);
            const list = response.data.list.map((item) => {
                item.content = item.content.replace(/\\/g, "");
                return item;
            });
            setContent(list[0].content);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (modify) {
            updateContent();
        }
    }, []);

    return (
        <div className="comment_write">
            <p className="comment-write-profile">
                <img src={`http://localhost/myboard_server/Users/Profile/${userProfile}`} alt="user_profile" className="comment-profile-img" />
                <span className="comment-profile-name" >
                {userName}
                </span>
            </p>

            <ReactQuill
                ref={commentQuillRef}
                onChange={handleContentChange}
                theme="snow"
                modules={modules}
                formats={formats}
                value={content}
                className="write_comment"
            ></ReactQuill>
            <ul className="comment-write-btn_wrap">
                <li className="comment-btn-img">
                    <button className="comment-write-sticker">스티커</button>
                    <button onClick={() => handleImageUpload()} className="comment-write-sticker">
                        사진
                    </button>
                </li>
                <li className="comment-btn-submit">
                    <button onClick={() => onUpdateClick()} className="comment-write-submit">
                        등록
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default WriteComment;
