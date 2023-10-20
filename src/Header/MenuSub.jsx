import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { debounce } from "lodash";

function MenuSub(props) {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const userId = useSelector((state) => state.userId);
    const [onSubscribe, setOnSubscribe] = useState(false);
    const [userSubscribe, setUserSubscribe] = useState([]);
    const [text, setText] = useState("");
    const [inputFocus, setInputFocus] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const inputRef = useRef(null);
    const [searchmode, setSearchmode] = useState("main");
    const [hotBoard, setHotBoard] = useState([]);

    const boardSubscribe = "http://localhost/myboard_server/Board/Board_Subscribe.php";

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

    const readHotBoard = async () => {
        try {
            const response = await axios.get("http://localhost/myboard_server/Board/Board_List.php");
            console.log(response.data);
            setHotBoard(response.data.list);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubscribe = async (key, userId) => {
        const formData = new FormData();
        formData.append("user_id", userId ? userId : userId);
        formData.append("board_id", key);
        formData.append("mode", "unsubscribe");

        try {
            const subscribeCheck = await axios.post(boardSubscribe, formData);
            if (subscribeCheck.data.is_subscribe === false) {
                setOnSubscribe(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getSearchList = debounce(async (text) => {
        try {
            const formData = new FormData();
            formData.append("search", text);
            const response = await axios.post("http://localhost/myboard_server/Board/Board_Search.php", formData);
            setSearchList(response.data.list);
        } catch (error) {
            console.error(error);
        }
    }, 500);

    useEffect(() => {
        readHotBoard();
    }, []);

    useEffect(() => {
        if (text.length > 1) {
            getSearchList(text);
        } else {
            setSearchList([]);
        }
    }, [text]);

    useEffect(() => {
        readSubscribeList();
    }, [userId]);

    useEffect(() => {
        readSubscribeList();
        setOnSubscribe(false);
    }, [onSubscribe]);

    return (
        <div className="w-2/3 flex shadow-xl z-40 relative bg-base-100">
            {isLoggedIn ? (
                <div className="w-full">
                    <div className={searchmode === "main" ? "header-board-togo-list active" : "header-board-togo-list"}>
                        <div className="header-board-togo-title">
                            <h3>구독한 게시판</h3>
                        </div>
                        <ul>
                            {userSubscribe && userSubscribe.length > 0 ? (
                                userSubscribe.map((subscribe, index) => (
                                    <li key={index}>
                                        <Link to={`/board/${subscribe.board_id}`}>
                                            <span>{subscribe.board_name}</span>
                                        </Link>
                                        <button onClick={() => handleSubscribe(subscribe.board_id, userId)} className="header-btn-unsubscribe">
                                            구독취소
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span>구독한 게시판이 없습니다.</span>
                                </li>
                            )}
                            <li>
                                <button onClick={() => setSearchmode("list")}>게시판 찾아보기</button>
                                <button onClick={() => setSearchmode("search")}>게시판 검색</button>
                            </li>
                        </ul>
                    </div>
                    <div className={searchmode === "list" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <ul>
                            <div className="header-board-togo-title">
                                <h3>인기 게시판</h3>
                            </div>
                            {hotBoard && hotBoard.length > 0 ? (
                                hotBoard.map((hot, index) => (
                                    <li key={index}>
                                        <Link to={`/board/${hot.id}`}>
                                            <span>{hot.board_name}</span>
                                            <span>{hot.board_subscriber} 구독자</span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span>게시판 리스트 출력실패</span>
                                </li>
                            )}
                        </ul>
                        <button onClick={() => setSearchmode("main")}>구독한 게시판으로</button>
                    </div>

                    <div className={searchmode === "search" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <div className="header-board-togo-title">
                            <h3>게시판 찾기</h3>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                            ref={inputRef}
                            className="main-search-board"
                        />
                        <ul className={inputFocus ? "searchbox active" : "searchbox"}>
                            {searchList < 1 ? (
                                <li>검색어를 입력해주세요.</li>
                            ) : (
                                searchList.map((search, index) => (
                                    <li key={index}>
                                        <Link to={`/board/${search.id}`}>{search.board_name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                        <button onClick={() => setSearchmode("main")}>구독한 게시판으로</button>
                    </div>
                </div>
            ) : (
                <div className="header-board-togo-wrap">

                <div className = {searchmode === "main" ? "header-board-togo-search active" : "header-board-togo-search"}>
                    <ul>
                        <div className="header-board-togo-title">
                            <h3>인기 게시판</h3>
                        </div>
                        {hotBoard && hotBoard.length > 0 ? (
                            hotBoard.map((hot, index) => (
                                <li key={index}>
                                    <Link to={`/board/${hot.id}`}>
                                        <span>{hot.board_name}</span>
                                        <span>{hot.board_subscriber} 구독자</span>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li>
                                <span>게시판 리스트 출력실패</span>
                            </li>
                        )}
                    </ul>
                    <button onClick={() => setSearchmode("search")}>게시판 검색</button>
                </div>
                <div className={searchmode === "search" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <div className="header-board-togo-title">
                            <h3>게시판 찾기</h3>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                            ref={inputRef}
                            className="main-search-board"
                        />
                        <ul className={inputFocus ? "searchbox active" : "searchbox"}>
                            {searchList < 1 ? (
                                <li>검색어를 입력해주세요.</li>
                            ) : (
                                searchList.map((search, index) => (
                                    <li key={index}>
                                        <Link to={`/board/${search.id}`}>{search.board_name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                        <button onClick={() => setSearchmode("main")}>게시판 목록으로</button>
                    </div>
            </div>
            )}
        </div>
    );
}

export default MenuSub;
