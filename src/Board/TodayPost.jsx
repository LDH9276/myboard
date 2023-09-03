import React, {useEffect, useState, useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/free-mode';
import { useSelector } from 'react-redux';


function TodayPost(props) {

  const todayPost = "http://localhost/myboard_server/Board/Post_TodayPost.php";
  const boardId = useSelector(state => state.boardId);
  const [slidesTotal, setSlidesTotal] = useState(true);
  const [todayList, setTodayList] = useState([]);
  const todaySlide = useRef(null);

  const readTodayPost = async () => {
    try {
      const response = await axios.get(`${todayPost}?board=${boardId}`);
      console.log(response.data);
      if(response.data.today_postlist.length < 3){
        setSlidesTotal(false);
      } else {
        setSlidesTotal(true);
      }
      setTodayList(response.data.today_postlist);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    readTodayPost();
    todaySlide.current.swiper.slideTo(3);
  }, [boardId]);

  return (
    <div>
      <Swiper
        ref={todaySlide}
        spaceBetween={16}
        slidesPerView={'auto'}
        modules={[FreeMode]}
        loop={slidesTotal}
        loopedSlides={3}
        className='todayboard-list-wrap'
      >
        {Array.isArray(todayList) && todayList.map(item => (
          <SwiperSlide key={item.id}>
            <Link to={`/read/${item.id}`} className='today-list-item'>
              <p className='today-item-category'>게시판 인기글</p>
              <p className='today-item-title'>{item.title} </p>
              
              <div className="today-item-bottom_wrap">
                <p className='today-item-writer'><img src={`http://localhost/myboard_server/Users/Profile/${item.profile_imgname}.${item.profile_img}`} alt={item.nickname}  className='today-item-profile'/>{item.nickname}</p>
                <p className='today-badge-wrap'>
                  <span className='today-badge-like'><img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt='댓글수' className='today-item-icon'/>{item.total_like}</span>
                  <span className='today-badge-like'><img src={`${process.env.PUBLIC_URL}/btn/comment.svg`} alt='댓글수' className='today-item-icon'/>{item.comment_count}</span>
                </p>
              </div>

            </Link>
          </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default TodayPost;