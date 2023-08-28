import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BottomNav from './BottomNav';
import TodayPost from './TodayPost';
import './css/list.css';

function ListModules({postCategory, boardCate, autoRefresh}) {

  const pagination = "http://localhost/myboard_server/Board/Module/Post_Pagination.php";
  const listCheck  = "http://localhost/myboard_server/Board/Module/Post_List.php";

  const boardId = sessionStorage.getItem('boardId');
  const [boardList, setBoardList] = useState([]);
  const [newPost, setNewPost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(5);
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  const totalList = async () => {
    try {
      const response = await axios.post(`${pagination}?board=${boardId}`)
      if(response.data.total === 0){
        setTotalPosts(1);
      } else{
        setTotalPosts(response.data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const list = async () => {
    try {
      const response = await axios.post(`${listCheck}?page=${currentPage}&board=${boardId}&boardCate=${boardCate}`);
      console.log(response.data.list);
      setBoardList(response.data.list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    totalList();
  }, []);

  useEffect(() => {
    list();
  }, [boardCate, boardId, currentPage]);


  // 실시간 갱신하기
  const refreshPage = async () => {
    const response = await axios.post(`${pagination}?board=${boardId}`);
    if(totalPosts < response.data.total){
      setNewPost(true);
    }
  };

  const newPostReset = () => {
    setNewPost(false);
    totalList();
    list();
  };

  useEffect(() => {
    console.log(totalPosts);
    console.log(autoRefresh);
    if (autoRefresh && currentPage < 11) {
      const interval = setInterval(() => {
        refreshPage();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      return;
    }
  }, [currentPage, totalPosts, autoRefresh]);

  const PostUpdateDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    // 1분 이내는 방금 전으로 표시
    if(now.getTime() - postDate.getTime() < 60000){
      return '방금 전';
    }
    // 1시간 이전은 분으로 표시
    else if(now.getTime() - postDate.getTime() < 3600000){
      return Math.floor((now.getTime() - postDate.getTime()) / 60000) + '분 전';
    }
    // 24시간 이전은 시간으로 표시
    else if(now.getTime() - postDate.getTime() < 86400000){
      return Math.floor((now.getTime() - postDate.getTime()) / 3600000) + '시간 전';
    }
    // 나머지는 xx년 xx월 xx일로 표시
    else {
      const postYear = postDate.getFullYear().toString().substr(2, 2);
      return postYear + '년 ' + (postDate.getMonth() + 1) + '월 ' + postDate.getDate() + '일';
    }
  }


  return (
    <div className='board-container'>
      <ul>
        {newPost ? <li className='board-list-newpost'><button onClick={()=>newPostReset()}>새 글이 추가 되었습니다! <br/> <span>갱신하기</span></button></li> : ''}
        {boardList.length === 0 ? <li className='board-list-newpost'>게시글이 없습니다.</li> : ''}
        {Array.isArray(boardList) && boardList.map(item => (
          <li key={item.id}>
            <Link to={`/read/${item.id}`} className='board-list-item'>
            <p className='board-item-category'>{postCategory[item.cat]}</p>
            <p className='board-item-title'>{item.title} </p>
            <p className='board-item-date'>{PostUpdateDate(item.reg_date)}</p>
            <p className='board-item-writer'><img src={`http://localhost/myboard_server/Users/Profile/${item.profile_imgname}.${item.profile_img}`} alt={item.nickname}  className='board-item-profile'/>{item.nickname}</p>
            <p className='board-badge-wrap'>
              <span className='board-badge-like'><img src={`${process.env.PUBLIC_URL}/btn/like.svg`} alt='댓글수' className='board-item-icon'/>{item.total_like}</span>
              <span className='board-badge-like'><img src={`${process.env.PUBLIC_URL}/btn/comment.svg`} alt='댓글수' className='board-item-icon'/>{item.comment_count}</span>
            </p>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination
        total={totalPosts}
        limit={postsPerPage}
        page={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
}

export default ListModules;