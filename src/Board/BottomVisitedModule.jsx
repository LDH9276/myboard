import React, {useState} from "react";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/free-mode";
import Subscribe from "./Subscribe";

function VisitedModule({ boardVisited = [], userSubscribe = [], handleSubscribe}) {
    const [toggle, setToggle] = useState(false);

    return (
        <div className="board-visitlist-box">
            {boardVisited.length === 0 ? (
                <div className="board-visitlist-wrap">
                    <div className="board-visitlist-legend">방문 게시판</div>
                    <div className="board-visitlist">
                        <p className="board-visitlist-item empty">방문한 게시판이 없습니다.</p>
                    </div>
                </div>
            ) : (
                <div className="board-visitlist-wrap">
                    <div className="board-visitlist-legend">방문 게시판</div>
                        <ul className="board-visitlist">
                            {boardVisited.slice(0,4).map((board) => (
                                <li key={board.id}>
                                    <Link to={`/board/${board.id}`} className="board-visitlist-item">
                                        {board.board_name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    <div className="board-visitlist-subscribe">
                        <button onClick={() => {toggle ? setToggle(false) : setToggle(true)}}>
                            <img src={`${process.env.PUBLIC_URL}/btn/list-arrow.svg`} alt="구독한 게시판" className={!toggle ? 'board-visitlist-icon' : 'board-visitlist-icon active'} />
                        </button>
                    </div>
                    <div className={!toggle ? 'board-subscribe-list' : 'board-subscribe-list active'}>
                        <ul>
                            <li>구독한 게시판</li>
                            {userSubscribe.map((board) => (
                                <Subscribe key={board.board_id} boardId={board.board_id} board={board.board_name} handleSubscribe={handleSubscribe}/>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VisitedModule;
