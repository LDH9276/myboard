import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ListStyle from './css/list.module.css';
import { useDispatch } from 'react-redux';
import { totalCommentLists } from '../Redux/CommentList';

function List(props) {

  const pagination = "http://localhost/myboard_server/Board/Post_Pagination.php";
  const listCheck  = "http://localhost/myboard_server/Board/Post_List.php";
  const commentList = "http://localhost/myboard_server/Board/Post_CommentList.php";

  const { boardname } = useParams();
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postsPerPage] = useState(10);
  const dispatch = useDispatch();

  const totalList = async () => {
    try {
      const response = await axios.post(pagination);
      setTotalPosts(response.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  const list = async () => {
    try {
      const response = await axios.post(`${listCheck}?page=${currentPage}`);
      setBoardList(response.data.list);
    } catch (error) {
      console.error(error);
    }
  };

  const listComment = async () => {
    try {
      const response = await axios.post(`${commentList}?page=${currentPage}`);
      const list = response.data.list.map(item => {
        item.content = item.content.replace(/\\/g, '');
        return item;
      });

      const parentComments = [];
      const firstDepthComments = [];
      const secondDepthComments = [];

      list.forEach(item => {
        if (item.comment_parent === null) {
          parentComments.push(item);
        } else if (item.comment_depth === 1) {
          firstDepthComments.push(item);
        } else {
          secondDepthComments.push(item);
        }
      });

      parentComments.forEach(parent => {
        parent.children = firstDepthComments.filter(child => child.comment_parent === parent.id);
        parent.children.forEach(child => {
          child.children = secondDepthComments.filter(grandChild => grandChild.comment_parent === child.comment_parent);
        });
      })

      const hierarchicalComments = parentComments;

      dispatch(totalCommentLists(hierarchicalComments));

      console.log(totalCommentLists(hierarchicalComments))

    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    totalList();
  }, []);

  useEffect(() => {
    list();
    listComment();
  }, [currentPage]);

  // 실시간 갱신하기
  const refreshPage = async () => {
    const response = await axios.post(pagination);
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
    if (currentPage < 11) {
      const interval = setInterval(refreshPage, 5000);
      return () => clearInterval(interval);
    } else {
      return;
    }
  }, [currentPage, totalPosts]);

  return (
    <div className='board-container'>
      <ul>
        <li className={ListStyle.listItem}>
          <p>ID</p>
          <p>Title</p>
          <p>Writer</p>
          <p>Reg Date</p>
        </li>
        {newPost ? <li><button onClick={()=>newPostReset()}>갱신하기</button></li> : ''}
        {Array.isArray(boardList) && boardList.map(item => (
          <li key={item.id}>
            <Link to={`/read/${item.id}`} className={ListStyle.item}>
            <p>{item.id}</p>
            <p>{item.title} [{item.comment_count}]</p>
            <p>{item.writer}</p>
            <p>{item.reg_date}</p>
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate('/write')}>글쓰기</button>

      <Pagination
        total={totalPosts}
        limit={postsPerPage}
        page={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
}

export default List;