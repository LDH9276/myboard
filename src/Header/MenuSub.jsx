import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { userBtn } from "../Redux/Usermenu";

function MenuSub(props) {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const userId = useSelector((state) => state.userId);
    const [onSubscribe, setOnSubscribe] = useState(false);
    const [userSubscribe, setUserSubscribe] = useState([]);
    const [text, setText] = useState("");
    const [inputFocus, setInputFocus] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const inputRef = useRef(null);
    const searchmode = useSelector((state) => state.searchmode);
    const [hotBoard, setHotBoard] = useState([]);
    const dispatch = useDispatch();

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
        if (!isLoggedIn) {
            dispatch(userBtn("list"));
        }
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
        dispatch(userBtn("main"));
    }, [userId]);

    useEffect(() => {
        if (!userId){
            dispatch(userBtn("list"));
        } else {
            dispatch(userBtn("main"));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        readSubscribeList();
        setOnSubscribe(false);
    }, [onSubscribe]);

    return (
        <div className="w-2/3 flex shadow-xl z-40 relative bg-base-100 border-primary border-4 p-4 box-border">
            {isLoggedIn ? (
                <div className="w-full">
                    <div className={searchmode === "main" ? "w-full h-full relative" : "hidden"}>
                        <div className="font-bold text-lg mb-2">
                            <h3>구독게시판</h3>
                        </div>
                        <ul>
                            {userSubscribe && userSubscribe.length > 0 ? (
                                userSubscribe.slice(0, 4).map((subscribe, index) => (
                                    <li key={index} className="py-2 border-b-[1px] flex justify-between">
                                        <Link to={`/board/${subscribe.board_id}`}>
                                            <span className="leading-6 text-sm md:text-base">{subscribe.board_name}</span>
                                        </Link>
                                        <button
                                            onClick={() => handleSubscribe(subscribe.board_id, userId)}
                                            className="leading-6 w-14 border-2 border-secondary text-xs font-medium text-secondary"
                                        >
                                            구독취소
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span>구독한 게시판이 없습니다.</span>
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className={searchmode === "list" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <ul>
                            <div className="font-bold text-lg mb-2">
                                <h3>인기 게시판</h3>
                            </div>
                            {hotBoard && hotBoard.length > 0 ? (
                                hotBoard.map((hot, index) => (
                                    <li key={index} className="py-2 border-b-[1px] text-sm">
                                        <Link to={`/board/${hot.id}`} className=" flex justify-between">
                                            <span className="leading-6">{hot.board_name}</span>
                                            <span className="leading-6 text-secondary">{hot.board_subscriber} 구독자</span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span>게시판 리스트 출력실패</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className={searchmode === "search" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <div className="header-board-togo-title">
                            <h3 className="font-bold text-lg mb-2">게시판 찾기</h3>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                            ref={inputRef}
                            className="w-full border-primary border-b-2 outline-none focus:border-secondary"
                        />
                        <ul className={inputFocus ? "searchbox active h-full" : "searchbox h-full"}>
                            {searchList < 1 ? (
                                <li className="w-full h-3/4 flex justify-center items-center">
                                    <span>검색어를 입력해주세요.</span>
                                </li>
                            ) : (
                                searchList.map((search, index) => (
                                    <li key={index} className="py-3 border-b-[1px] flex justify-between text-sm">
                                        <Link to={`/board/${search.id}`}>{search.board_name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <div className={searchmode === "main" ? "w-full h-full relative" : "hidden"}>
                        <div className="font-bold text-lg mb-2">
                            <h3>구독게시판</h3>
                        </div>
                        <ul>
                            <span>
                                비회원입니다. <br /> 로그인 후 확인이 가능합니다.
                            </span>
                        </ul>
                    </div>
                    <div className={searchmode === "list" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <ul>
                            <div className="font-bold text-lg mb-2">
                                <h3>인기 게시판</h3>
                            </div>
                            {hotBoard && hotBoard.length > 0 ? (
                                hotBoard.map((hot, index) => (
                                    <li key={index} className="py-2 border-b-[1px] text-sm">
                                        <Link to={`/board/${hot.id}`} className=" flex justify-between">
                                            <span className="leading-6">{hot.board_name}</span>
                                            <span className="leading-6 text-secondary">{hot.board_subscriber} 구독자</span>
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span>게시판 리스트 출력실패</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className={searchmode === "search" ? "header-board-togo-search active" : "header-board-togo-search"}>
                        <div className="header-board-togo-title">
                            <h3 className="font-bold text-lg mb-2">게시판 찾기</h3>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setText(e.target.value)}
                            onFocus={() => setInputFocus(true)}
                            onBlur={() => setInputFocus(false)}
                            ref={inputRef}
                            className="w-full border-primary border-b-2 outline-none focus:border-secondary"
                        />
                        <ul className={inputFocus ? "searchbox active h-full" : "searchbox h-full"}>
                            {searchList < 1 ? (
                                <li className="w-full h-3/4 flex justify-center items-center">
                                    <span>검색어를 입력해주세요.</span>
                                </li>
                            ) : (
                                searchList.map((search, index) => (
                                    <li key={index} className="py-3 border-b-[1px] flex justify-between text-sm">
                                        <Link to={`/board/${search.id}`}>{search.board_name}</Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MenuSub;
