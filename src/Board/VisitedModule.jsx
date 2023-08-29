import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

import { FreeMode } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';

function VisitedModule({boardVisited}) {
    
    return (
        <div className='board-visitlist-box'>
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
        </div>
    );
}

export default VisitedModule;