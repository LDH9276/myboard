import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import { useSelector } from 'react-redux';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/free-mode';


function TodayPost({postCategory, PostUpdateDate, newPost, newPostReset}) {

  const navigate = useNavigate();
  const todayPost = "http://localhost/myboard_server/Board/Post_TodayPost.php";
  const boardId = sessionStorage.getItem('boardId');
  const [slidesTotal, setSlidesTotal] = useState(true);

  const [todayList, setTodayList] = useState([]);

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
  }, [boardId]);

  return (
    <div>
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        modules={[FreeMode]}
        loop={slidesTotal}
        loopedSlides={3}
        className='todayboard-list-wrap'
      >
        {newPost ? <li><button onClick={()=>newPostReset()}>갱신하기</button></li> : ''}
        {Array.isArray(todayList) && todayList.map(item => (
          <SwiperSlide>
            <Link to={`/read/${item.id}`} className='today-list-item' key={item.id}>
            <p className='today-item-category'>{postCategory[item.cat]}</p>
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