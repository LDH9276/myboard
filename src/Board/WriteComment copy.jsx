import React, { useEffect, useState } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomEditor from "@ckeditor/ckeditor5-custom";
import { useSelector, useDispatch } from "react-redux";

function WriteComment({ id, commentId, modify, answer, depth }) {
    // State, Props
    const uploadedComment = useSelector((state) => state.uploadedComment);
    const editCommentId = useSelector((state) => state.editCommentId);
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [flag, setFlag] = useState(false);
    const userId = useSelector((state) => state.userId);
    const dispatch = useDispatch();

    // Link
    const imgLink = "http://localhost/myboard_server/Board/Upload";
    const postUploadLink = "http://localhost/myboard_server/Board/Post_Upload.php";
    const postCommentLink = "http://localhost/myboard_server/Board/Post_WriteComment.php";
    const postCommentRead = "http://localhost/myboard_server/Board/Post_ReWriteComment.php";

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
        formData.append("content", content);
        formData.append("post_id", id);
        formData.append("reg_date", new Date());

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
            setTitle(list[0].title);
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
        <div>
            <CKEditor
                editor={CustomEditor}
                config={{
                    extraPlugins: [uploadPlugin],
                }}
                data={content}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
            />
            <button onClick={() => onUpdateClick()}>등록</button>
        </div>
    );
}

export default WriteComment;
