import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import { FreeMode } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';

function VisitedModule({boardVisited, userSubscribe}) {
    
    return (
        <div className='board-visitlist-box'>
            {boardVisited.length === 1 ? (
                <div className="board-visitlist-wrap">
                    <div className="board-visitlist-legend">
                        방문한 게시판
                    </div>
                    <div className="board-visitlist">
                        <p className='board-visitlist-item empty'>
                            방문한 게시판이 없습니다.
                        </p>
                    </div>
                </div> 
                ) : (
                <div className="board-visitlist-wrap">
                    <div className="board-visitlist-legend">
                        방문한 게시판
                    </div>
                    {boardVisited.length > 10 ? (
                        <Swiper
                        slidesPerView={4}
                        freeMode={true}
                        modules={[FreeMode]}
                        className='board-visitlist'
                        >
                        {boardVisited.map((board) => (
                            <SwiperSlide key={board.id}>
                                <Link to={`/board/${board.id}`} className='board-visitlist-item'>
                                    {board.board_name}
                                </Link>
                            </SwiperSlide>
                        ))}
                        </Swiper>
                    ) : (
                        <ul className='board-visitlist'>
                        {boardVisited.map((board) => (
                            <li key={board.id}>
                                <Link to={`/board/${board.id}`} className='board-visitlist-item'>
                                    {board.board_name}
                                </Link>
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
                )}
                {userSubscribe.length === 0 ? '' : (
                <div className="board-subscribelist-wrap">
                    <div className="board-subscribelist-legend">
                            <button className='board-subscribelist-btn'>
                                <img src={`${process.env.PUBLIC_URL}/btn/list-arrow.svg`} alt='구독한 게시판' className='board-subscribelist-icon'/>
                            </button>
                    </div>
                    <ul className='board-subscribe-list'>
                        <li>
                        구독한 게시판
                        </li>
                        {userSubscribe.map((board) => (
                            <li key={board.board_id}>
                                <Link to={`/board/${board.board_id}`} className='board-subscribelist-item'>
                                    {board.board_name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                )}
        </div>
    );
}

export default VisitedModule;