import React, { useRef, useState, useEffect, useMemo } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import { formats, toolbarOptions } from "./boardmodules/Module";
Quill.register("modules/imageResize", ImageResize);

function PostWrite({ modContent }) {
    const quillRef = useRef();
    const [content, setContent] = useState("");
    const imageUploadLink = "http://localhost/myboard_serverl/Board/Post_Upload.php";

    function handleContentChange(value) {
        setContent(value);
    }

    useEffect(() => {
        if (modContent) {
            setContent(modContent);
            quillRef.current.getEditor().setContents(content);
        }
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
                const imageUrl = `http://localhost/myboard_serverl/Board/Upload/${data.filename}`;

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

    useEffect(() => {
        console.log(content);
    }, [content]);

    return (
        <div>
            <ReactQuill ref={quillRef} onChange={handleContentChange} placeholder={"내용을 입력해주세요"} theme="snow" modules={modules} formats={formats}></ReactQuill>
        </div>
    );
}

export default PostWrite;
