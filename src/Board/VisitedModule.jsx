import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/free-mode";
import Subscribe from "./Subscribe";

function VisitedModule({ boardVisited = [], userSubscribe = [], handleSubscribe }) {
    const userId = useSelector((state) => state.userId);
    const [toggle, setToggle] = useState(false);

    return (
        <div className="w-full relative box-border px-4 z-50">
            {boardVisited.length === 0 ? (
                <div className="w-full bg-base-200 shadow-xl">
                    <div className="board-visitlist-legend">방문 게시판</div>
                    <div className="board-visitlist">
                        <p className="board-visitlist-item empty">방문한 게시판이 없습니다.</p>
                    </div>
                </div>
            ) : (
                <div className="w-full h-[48px] overflow-hidden bg-base-200 flex justify-start shadow-lg my-8">
                    <div className="w-[80px] h-full leading-[48px] text-center text-white bg-primary text-xs font-bold">방문 게시판</div>
                    <ul className="flex bg-base-200">
                        {boardVisited.slice(0, 5).map((board) => (
                            <li key={board.id}>
                                <Link to={`/board/${board.id}`} className="block w-8 mx-2 text-center text-xs text-base-content leading-[48px] bg-base-200">
                                    {board.board_name.slice(0, 2)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="w-12 h-12 absolute top-0 right-4 flex items-center justify-center bg-base-200">
                        <button
                            onClick={() => { toggle ? setToggle(false) : setToggle(true); }} >
                            <img src={`${process.env.PUBLIC_URL}/btn/list-arrow.svg`} alt="구독한 게시판" className={!toggle ? "board-visitlist-icon" : "board-visitlist-icon active"} />
                        </button>
                    </div>

                    {userId ? (
                        <div className={!toggle ? "board-subscribe-list" : "board-subscribe-list active"}>
                            <ul>
                                <li>구독한 게시판</li>
                                {userSubscribe.map((board) => (
                                    <Subscribe key={board.board_id} boardId={board.board_id} board={board.board_name} handleSubscribe={handleSubscribe} />
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className={!toggle ? "board-subscribe-list" : "board-subscribe-list active"}>
                            <ul>
                                <li>로그인 후 구독한 게시판을 확인할 수 있습니다.</li>
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default VisitedModule;
