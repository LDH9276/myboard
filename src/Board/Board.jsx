import React, { useEffect, useState } from "react";
import List from "./List";
import axios from "axios";
import dompurify from "dompurify";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import "./css/board.css";
import ListModule from "./ListModule";
import { boardOppend } from "../Redux/Board";
import VisitedModule from "./VisitedModule";
import TodayPost from "./TodayPost";

function Board() {
    // State
    const userId = useSelector((state) => state.userId);
    const boardLimit = useSelector((state) => state.boardLimit);
    const [boardCate, setBoardCate] = useState("*");
    const [boardList, setBoardList] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [postCategory, setPostCategory] = useState([]);
    const [boardVisited, setBoardVisited] = useState([]);
    const [subscribe, setSubscribe] = useState(false);
    const [totalBoardSubscribe, setTotalBoardSubscribe] = useState(0);
    const [userSubscribe, setUserSubscribe] = useState([]);

    // Link
    const boardVisitedLink = "http://localhost/myboard_server/Board/Board_VisitedCheck.php";
    const boardVisitedCheck = "http://localhost/myboard_server/Board/Board_VisitedModule.php";
    const passenger = "http://localhost/myboard_server/Board/Board_VisitedCheckPassinger.php";
    const boardSubscribe = "http://localhost/myboard_server/Board/Board_Subscribe.php";
    const boardLink = process.env.REACT_APP_BOARD_LIST_CHECK;

    // Dispatch,
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const readBoard = async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);

            const response = await axios.post(boardLink, formData);
            dispatch(boardOppend(id, response.data.boardlist[0].board_name, userId));
            setBoardList(response.data.boardlist);
            setPostCategory(response.data.boardlist[0].board_category);
        } catch (error) {
            console.error(error);
        }
    };

    const readSubscribe = async () => {
        const formData = new FormData();
        formData.append("board_id", id);
        formData.append("user_id", userId);
        formData.append("mode", "read");

        try {
            const subscribeCheck = await axios.post(boardSubscribe, formData);
            setSubscribe(subscribeCheck.data.is_subscribe);
            setTotalBoardSubscribe(subscribeCheck.data.board_subscriber);
        } catch (error) {
            console.error(error);
        }
    };

    const readSubscribeList = async () => {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("mode", "list_read");

        try {
            const subscribeCheck = await axios.post(boardSubscribe, formData);
            setUserSubscribe(subscribeCheck.data.subscribe);
            console.log(subscribeCheck.data.subscribe);
        } catch (error) {
            console.error(error);
        }
    };


    const readVisited = async () => {
        if (userId === "") {
            const visited = JSON.parse(localStorage.getItem("visited")) || [];
            if (visited.includes(id)) {
                visited.splice(visited.indexOf(id), 1);
                visited.unshift(id);
            } else {
                visited.unshift(id);
            }

            localStorage.setItem("visited", JSON.stringify([...new Set(visited)]));
            const postData = localStorage.getItem("visited");

            const formData = new FormData();
            formData.append("user_id", postData);
            const visitedCheck = await axios.post(passenger, formData);
            setBoardVisited(visitedCheck.data.result);
            console.log(visitedCheck.data.result);
        } else {
            const formData = new FormData();
            formData.append("user_id", userId);
            const visitedCheck = await axios.post(boardVisitedCheck, formData);
            setBoardVisited(visitedCheck.data.result);
            console.log(visitedCheck.data);
        }
    };

    const visitedAdd = async () => {
        const formData = new FormData();
        formData.append("user_id", userId);
        formData.append("board_id", id);
        const visitedAdd = await axios.post(boardVisitedLink, formData);
        readVisited();
    };

    const handleSubscribe = async (key, mode, index) => {
        if (mode) {
            setTotalBoardSubscribe(totalBoardSubscribe + 1);
        } else {
            setTotalBoardSubscribe(totalBoardSubscribe - 1);
        }

        const formData = new FormData();
        formData.append("user_id", userId ? userId : userId);
        formData.append("board_id", key);
        formData.append("mode", mode ? "subscribe" : "unsubscribe");

        try {
            const subscribeCheck = await axios.post(boardSubscribe, formData);
            if(index === "board") {
            setSubscribe(subscribeCheck.data.is_subscribe);
            } 
            readSubscribe();
            readSubscribeList();
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        readBoard();
        readSubscribe();
        readSubscribeList();

        if (isNaN(id)) {
            navigate("/");
        } else if (boardLimit < id) {
            navigate("/");
        }
        if (userId === "") {
            readVisited();
        } else {
            visitedAdd();
            readVisited();
        }
    }, [id, boardLimit]);

    return (
        <div className="board-container">
            {Array.isArray(boardList) &&
                boardList.map((board, index) => (
                    <div key={index} className="w-full">
                        <img src={`http://localhost/myboard_server/Board/BoardBanner/${board.board_thumbnail}`} alt={board.board_name} className="w-full h-[200px] object-cover" />
                        <div className="w-full flex justify-between items-center px-4 box-border">
                            <div className="w-full">
                                <h2 className="font-bold text-xl dark:text-primary">{board.board_name}</h2>
                                <p className="font-normal text-sm mt-2 dark:text-primary" dangerouslySetInnerHTML={{ __html: dompurify.sanitize(board.board_detail) }}></p>
                            </div>
                            {userId === "" ? (
                                <div className="board-subscribe">
                                    <p className="board-subscribe-total">
                                        <span>{totalBoardSubscribe}</span>
                                        <span>구독중</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="board-subscribe">
                                    <button
                                        onClick={subscribe ? () => handleSubscribe(id, false) : () => handleSubscribe(id, true, "board")}
                                        className={subscribe ? "board-subscribe-btn active" : "board-subscribe-btn"}
                                    >
                                        {subscribe ? "구독중" : "구독하기"}
                                    </button>
                                    <p className="board-subscribe-total">
                                        <span>{totalBoardSubscribe}</span>
                                        <span>구독중</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            <VisitedModule boardVisited={boardVisited} userSubscribe={userSubscribe} handleSubscribe={handleSubscribe}/>

            <TodayPost postCategory={postCategory} />

            <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh} />

            <List boardId={id} postCategory={postCategory} boardCate={boardCate} autoRefresh={autoRefresh} />
        </div>
    );
}

export default Board;
