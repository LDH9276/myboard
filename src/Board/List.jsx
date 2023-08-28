import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BottomNav from './BottomNav';
import TodayPost from './TodayPost';
import './css/list.css';

function List({boardId, postCategory, boardCate, autoRefresh}) {

  const pagination = "http://localhost/myboard_server/Board/Post_Pagination.php";
  const listCheck  = "http://localhost/myboard_server/Board/Post_List.php";

  const userId = useSelector(state => state.userId);
  const [boardList, setBoardList] = useState([]);
  const [newPost, setNewPost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(10);
  const [adminDelete, setAdminDelete] = useState([]);
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
      setBoardList(response.data.list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    list();
  }, [boardCate]);

  useEffect(() => {
    totalList();
  }, []);

  useEffect(() => {
    list();
  }, [currentPage]);

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
    if (autoRefresh && currentPage < 11) {
      const interval = setInterval(() => {
        refreshPage();
      }, 5000);
      return () => clearInterval(interval);
    } else {
      return;
    }
  }, [currentPage, totalPosts, autoRefresh]);

  const handelDeleteCheck = (id) => {
    console.log(adminDelete);
    if(adminDelete.includes(id)){
      setAdminDelete(adminDelete.filter(item => item !== id));
    } else {
      setAdminDelete([...adminDelete, id]);
      
    }
  };

  const deleteSubmit = async () => {
    console.log(adminDelete);
  };

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
      <TodayPost postCategory={postCategory} newPost={newPost} newPostReset={newPostReset} PostUpdateDate={PostUpdateDate}/>
      {userId === 'Admin' ? (
        <ul>
        {newPost ? <li className='board-list-newpost'><button onClick={()=>newPostReset()}>새 글이 추가 되었습니다! <br/> <span>갱신하기</span></button></li> : ''}
        {boardList.length === 0 ? <li className='board-list-newpost'>게시글이 없습니다.</li> : ''}
        {Array.isArray(boardList) && boardList.map(item => (
          <li key={item.id} className='board-admin-list'>
            <button name="delete" id={item.id} className={adminDelete.includes(item.id) ? 'board-delete-chkbox checked' : 'board-delete-chkbox'} onClick={() => handelDeleteCheck(item.id)}>
              &nbsp;
            </button>
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
        </ul>) : (
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
        </ul>)}
      {userId === 'Admin' ? (
        <div className='board-admin-btn-wrap'>
          <button className='board-admin-btn' onClick={() => {deleteSubmit()}}>삭제</button>
        </div>
      ) : ''}
      
      <Pagination
        total={totalPosts}
        limit={postsPerPage}
        page={currentPage}
        setPage={setCurrentPage}
      />
      {isLoggedIn ? (<BottomNav />) : ''}
    </div>
  );
}

export default List;