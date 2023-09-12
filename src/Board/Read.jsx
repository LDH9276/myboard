import React, { useEffect, useTransition, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import WriteComment from "./WriteComment";
import CommentList from "./CommentList";
import ListModules from "./ListModules";
import ListModule from "./ListModule";
import DOMPurify from "dompurify";
import "./css/read.css";
import { Tweet } from "react-twitter-widgets";

function Read({ userId }) {
    const { id } = useParams();
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const content = useSelector((state) => state.content);
    const boardId = useSelector((state) => state.boardId);
    const boardName = useSelector((state) => state.boardName);
    const writer = useSelector((state) => state.writer);
    const uploadedComment = useSelector((state) => state.uploadedComment);
    const [commentCount, setCommentCount] = useState(0);

    const [like, setLike] = useState(false);
    const [likeClickTime, setLikeClickTime] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [updateDate, setUpdateDate] = useState("");
    const [totalLike, setTotalLike] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [contents, setContents] = useState([]);
    const [boardCate, setBoardCate] = useState("*");
    const [boardList, setBoardList] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [postCategory, setPostCategory] = useState([]);
    const [twitterNumber, setTwitterNumber] = useState([]);

    const readBoard = async () => {
        try {
            const formData = new FormData();
            formData.append("id", boardId);

            const response = await axios.post(boardLink, formData);
            setBoardList(response.data.boardlist);
            setPostCategory(response.data.boardlist[0].board_category);
            console.log(response.data.boardlist);
        } catch (error) {
            console.error(error);
        }
    };

    function scrollToTop() {
        window.scrollTo(0, 0);
    }

    // Writer info
    const [WriterName, setWriterName] = useState("");
    const [WriterProfile, setWriterProfile] = useState("");
    const [WriterProfileImg, setWriterProfileImg] = useState("");

    // Link
    const postWriteLink = "http://localhost/myboard_server/Board/Post_Write.php";
    const contentChek = "http://localhost/myboard_server/Board/Post_Read.php";
    const postLikeLink = "http://localhost/myboard_server/Board/Post_Like.php";
    const postLikeChek = "http://localhost/myboard_server/Board/Post_CheckLike.php";
    const writerInfo = "http://localhost/myboard_server/Board/Post_WriterInfo.php";
    const boardLink = "http://localhost/myboard_server/Board/Board_ListCheck.php";

    useEffect(() => {
        readBoard();
    }, [userId]);

    const readContent = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);
            const response = await axios.post(contentChek, formData);

            console.log(response.data);

            const list = response.data.list.map((item) => {
                item.content = item.content.replace(/\\/g, "");
                return item;
            });

            console.log(list);

            const searchContent = list[0].content;
            const regex = /https:\/\/twitter\.com\/\w+\/status\/(\d+)(\?\S+)?/g;
            const twitterNumbers = [];
            const contentParts = [];
            const spanRegex = /<span[^>]*>(https:\/\/twitter\.com\/\w+\/status\/\d+\S*)<\/span>/g;
            let match;
            let spanContent = searchContent;
            while ((match = spanRegex.exec(searchContent)) !== null) {
                // exec는 매칭되는 것을 찾으면 배열로 반환하고, 매칭되는 것이 없으면 null을 반환한다.
                spanContent = spanContent.replace(match[0], match[1]); // match[0]은 매칭되는 전체 문자열, match[1]은 매칭되는 문자열 중 첫번째 그룹
            }

            let lastIndex = 0;
            while ((match = regex.exec(spanContent)) !== null) {
                const matchedNumber = match[1];
                twitterNumbers.push(matchedNumber);

                let part = spanContent.slice(lastIndex, match.index);

                const openTags = (part.match(/<p>/g) || []).length;
                const closeTags = (part.match(/<\/p>/g) || []).length;

                if (openTags > closeTags) {
                    part += "</p>";
                }

                contentParts.push(part);
                contentParts.push(`"${matchedNumber}"`);
                lastIndex = regex.lastIndex;
            }

            let part = spanContent.slice(lastIndex);
            const openTags = (part.match(/<p>/g) || []).length;
            const closeTags = (part.match(/<\/p>/g) || []).length;

            part = part.replace(/style="color:\s*rgb\(0,\s*0,\s*0\);">/g, "");

            if (closeTags < openTags) {
                part = "<p>" + part;
            }

            contentParts.push(part);

            console.log(contentParts);
            setTwitterNumber(twitterNumbers);

            dispatch({ type: "READ", payload: { writer: list[0].writer, content: list } });
            setContents(contentParts);
            console.log(contents);
            setUpdateDate(list[0].reg_date);
            setTotalLike(list[0].total_like);
            setCommentCount(list[0].comment_count);
        } catch (error) {
            console.error(error);
        }
    };

    const readLike = async () => {
        try {
            const formdata = new FormData();
            formdata.append("id", id);
            formdata.append("user_id", userId);
            const response = await axios.post(postLikeChek, formdata);
            if (response.data.like_status) {
                setLike(true);
            } else {
                setLike(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const readWriterInfo = async () => {
        try {
            const formdata = new FormData();
            formdata.append("writer", writer);
            const response = await axios.post(writerInfo, formdata);
            console.log(response.data);
            setWriterName(response.data.name);
            setWriterProfile(response.data.profile);
            setWriterProfileImg(response.data.profile_name + "." + response.data.profile_ext);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        startTransition(() => {
            readContent();
        });
    }, []);

    useEffect(() => {
        readContent();
    }, [uploadedComment]);

    useEffect(() => {
        scrollToTop();
        startTransition(() => {
            readContent();
        });
    }, [id]);

    useEffect(() => {
        readWriterInfo();
    }, [writer]);

    useEffect(() => {
        readLike();
    }, [userId]);

    const onDleteBtnClick = () => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            deletePost();
        } else {
            return;
        }
    };

    const deletePost = async () => {
        const formData = new FormData();
        formData.append("id", id);
        formData.append("delete", true);
        axios
            .post(postWriteLink, formData)
            .then((res) => {
                alert("삭제 완료");
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                alert("삭제 실패");
            });
    };

    const handleLikeAction = () => {
        // 이전 함수가 실행된지 3초 이내라면 실행하지 않음
        const now = new Date();
        if (now - likeClickTime < 1500) {
            console.log("3초 이내에는 실행할 수 없습니다.");
            return;
        } else {
            if (like) {
                setLike(false);
                const now = new Date();
                setLikeClickTime(now);
                setTotalLike(totalLike - 1);
                const formData = new FormData();
                formData.append("id", id);
                formData.append("user_id", userId);
                formData.append("like", false);
                axios
                    .post(postLikeLink, formData)
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.error(err.data);
                    });
            } else {
                setLike(true);
                const now = new Date();
                setLikeClickTime(now);
                setTotalLike(totalLike + 1);
                const formData = new FormData();
                formData.append("id", id);
                formData.append("user_id", userId);
                formData.append("like", true);
                axios
                    .post(postLikeLink, formData)
                    .then((res) => {
                        console.log(res.data);
                    })
                    .catch((err) => {
                        console.error(err.data);
                    });
            }
        }
    };

    const PostUpdateDate = (date) => {
        const now = new Date();
        const postDate = new Date(date);
        // 1분 이내는 방금 전으로 표시
        if (now.getTime() - postDate.getTime() < 60000) {
            return "방금 전";
        }
        // 1시간 이전은 분으로 표시
        else if (now.getTime() - postDate.getTime() < 3600000) {
            return Math.floor((now.getTime() - postDate.getTime()) / 60000) + "분 전";
        }
        // 24시간 이전은 시간으로 표시
        else if (now.getTime() - postDate.getTime() < 86400000) {
            return Math.floor((now.getTime() - postDate.getTime()) / 3600000) + "시간 전";
        }
        // 나머지는 xx년 xx월 xx일로 표시
        else {
            const postYear = postDate.getFullYear().toString().substr(2, 2);
            return postYear + "년 " + (postDate.getMonth() + 1) + "월 " + postDate.getDate() + "일";
        }
    };

    return (
        <div className="board-container">
            <ul>
                <li className="board_title">
                    <Link to={`/board/${boardId}`}>
                        <h2 className="read-board-name">{boardName}</h2>
                    </Link>
                </li>
                <li>
                    <div className="read-writer-wrap">
                        <div className="read-writer-profile">
                            <div className="read-writer-info">
                                <img src={`http://localhost/myboard_server/Users/Profile/${WriterProfileImg}`} alt="profile" className="read-profile-img" />
                                <div className="read-wtire-text">
                                    <p className="read-profile-name">{WriterName}</p>
                                    <p className="read-profile-time">{PostUpdateDate(updateDate)}</p>
                                </div>
                            </div>
                            <div className="read-post-status">
                                <p>
                                    <img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt="like" className="read-profile-icon" />
                                    {totalLike}
                                </p>
                                <p>
                                    <img src={`${process.env.PUBLIC_URL}/btn/comment.svg`} alt="comment" className="read-profile-icon" />
                                    {commentCount}
                                </p>
                            </div>
                        </div>

                        <div className="read-title-wrap">
                            <p className="read-title-category">{content[0] && postCategory[content[0].cat]}</p>
                            <h3 className="read-title-subject">{content ? content[0].title : ""}</h3>
                        </div>

                        <div className="read-content-wrap">
                            {contents.map((part, index) => {
                                if (part.startsWith('"') && part.endsWith('"')) {
                                    const tweetId = part.replace(/"/g, "");
                                    return <Tweet key={index} tweetId={tweetId} />;
                                }
                                part = part.replace(/style="background-color:\s*rgb\(255,\s*255,\s*255\);\s*color:\s*rgb\(0,\s*0,\s*0\);">/g, "");
                                part = part.replace(/style="color:\s*rgb\(0,\s*0,\s*0\);\s*background-color:\s*rgb\(255,\s*255,\s*255\);">/g, "");
                                return (
                                    <div
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(part, {
                                                ALLOWED_TAGS: ["div", "strong", "b", "p", "iframe"],
                                                ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
                                            }),
                                        }}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                </li>
            </ul>

            {writer === userId ? (
                <div className="read-btn-wrap">
                    <button onClick={() => navigate(`/write/${id}/modify`)}>
                        <img src={`${process.env.PUBLIC_URL}/btn/modify.svg`} alt="수정버튼" />
                    </button>
                    <button onClick={onDleteBtnClick}>
                        <img src={`${process.env.PUBLIC_URL}/btn/delete.svg`} alt="수정버튼" />
                    </button>
                </div>
            ) : null}

            {/* <button onClick={() => navigate(`/board/${boardId}`)}>목록으로</button> */}

            <div className="comment">
                {isPending ? <p>Loading...</p> : <CommentList id={id} userId={userId} />}
                {isLoggedIn ? <WriteComment id={id} /> : ""}
            </div>

            {isLoggedIn ? (
                <div className="board-bottom-wrap">
                    <button onClick={() => handleLikeAction()} className="board-like-btn">
                        <div className="bottom-like-wrap">
                            <img src={`${process.env.PUBLIC_URL}/btn/like_btn.svg`} alt="write" className="bottom-like_back" />
                            <img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt="write" className={like ? "bottom-like_icon active" : "bottom-like_icon"} />
                        </div>
                        <span>{content ? totalLike : "0"}</span>
                    </button>
                    <button onClick={() => navigate("/write")} className="main-write-btn">
                        <img src={`${process.env.PUBLIC_URL}/btn/write.svg`} alt="write" />
                    </button>
                </div>
            ) : (
                ""
            )}
            <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh} />
            <ListModules boardId={boardId} postCategory={postCategory} boardCate={boardCate} autoRefresh={true} />
        </div>
    );
}

export default Read;
