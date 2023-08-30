import React, { useEffect, useState } from 'react';
import List from './List';
import axios from 'axios';
import dompurify from 'dompurify';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, json } from 'react-router-dom';
import './css/board.css';
import ListModule from './ListModule';
import { boardOppend } from '../Redux/Board';
import VisitedModule from './VisitedModule';

function Board() {

  const userId = useSelector(state => state.userId);
  const boardLink = process.env.REACT_APP_BOARD_LIST_CHECK;
  const dispatch = useDispatch();
  const [boardCate, setBoardCate] = useState('*');
  const [boardList, setBoardList] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [postCategory, setPostCategory] = useState([]);
  const [boardVisited, setBoardVisited] = useState([]);
  const [subscribe, setSubscribe] = useState(false);
  const [totalBoardSubscribe, setTotalBoardSubscribe] = useState(0);
  const [userSubscribe, setUserSubscribe] = useState([]);

  const boardVisitedLink = "http://localhost/myboard_server/Board/Board_VisitedCheck.php"
  const boardVisitedCheck = "http://localhost/myboard_server/Board/Board_VisitedModule.php";
  const passenger = "http://localhost/myboard_server/Board/Board_VisitedCheckPassinger.php";
  const boardSubscribe = "http://localhost/myboard_server/Board/Board_Subscribe.php";

  const { id } = useParams();

  const readBoard = async () => {
    try {
      const response = await axios.post(`${boardLink}?id=${id}`);
      dispatch(boardOppend(id, response.data.boardlist[0].board_name, userId));
      setBoardList(response.data.boardlist);
      setPostCategory(response.data.boardlist[0].board_category);
    } catch (error) {
      console.error(error);
    }
  }

  const readSubscribe = async () => { 
    const formData = new FormData();
    formData.append('board_id', id);
    formData.append('user_id', userId ? userId : sessionStorage.getItem('userId'));
    formData.append('mode', 'read');

    const subscribeCheck = await axios.post(boardSubscribe, formData);
    console.log(subscribeCheck.data);
    setSubscribe(subscribeCheck.data.is_subscribe);
    setTotalBoardSubscribe(subscribeCheck.data.board_subscriber);
  }

  const readUserSubscribe = async () => {
    const formData = new FormData();
    formData.append('board_id', id);
    formData.append('user_id', sessionStorage.getItem('userId'));
    formData.append('mode', 'list_read');

    const subscribeCheck = await axios.post(boardSubscribe, formData);
    setUserSubscribe(subscribeCheck.data.user_subscribe_list);
    console.log(userSubscribe);
  }


  const visitedCheck = async () => {
    if (userId === '') {
      
      const visited = JSON.parse(localStorage.getItem('visited')) || [];
      if (visited.includes(id)) {
        visited.splice(visited.indexOf(id), 1);
        visited.unshift(id);
      } else {
        visited.unshift(id);
      }
      localStorage.setItem('visited', JSON.stringify([...new Set(visited)]));
      const postData = localStorage.getItem('visited');

      const formData = new FormData();
      formData.append('user_id', postData);
      const visitedCheck = await axios.post(passenger, formData);
      setBoardVisited(visitedCheck.data.result);
    }
    else {
      const formData = new FormData();
      formData.append('user_id', sessionStorage.getItem('userId'));
      const visitedCheck = await axios.post(boardVisitedCheck, formData);
      setBoardVisited(visitedCheck.data.result);
    }
  }

  useEffect(() => {
    if(id !== undefined || id !== null){
      readSubscribe();
    }
  }, [subscribe]);
  
  useEffect(() => {
    readSubscribe();
    readBoard();
    if(userId === '') {
      visitedCheck();
    }
  }, [id]);
    
  useEffect(() => {
    readUserSubscribe();
    visitedAdd();
    visitedCheck();
  }, [userId, id]);
  
  const visitedAdd = async () => {
    const formData = new FormData();
    formData.append('user_id', sessionStorage.getItem('userId'));
    formData.append('board_id', id);
    const visitedAdd = await axios.post(boardVisitedLink, formData);
    visitedCheck();
  }

  const handleSubscribe = async (mode) => {
    console.log(mode);
    const formData = new FormData();
    formData.append('user_id', userId? userId : sessionStorage.getItem('userId'));
    formData.append('board_id', id);
    formData.append('mode', mode ? 'subscribe' : 'unsubscribe');
    const subscribeCheck = await axios.post(boardSubscribe, formData);
    setSubscribe(subscribeCheck.data.is_subscribe);
    console.log(subscribeCheck.data);
  }

  return (
    <div className='board-container'>
      {Array.isArray(boardList) && boardList.map((board, index) => (
        <div key={index} className='board-index'>
          <img src={`http://localhost/myboard_server/Board/BoardBanner/${board.board_thumbnail}`} alt={board.board_name} className='board-thumb'/>
          <div className="board-detail">
            <h2>
              {board.board_name}
            </h2>
            <p dangerouslySetInnerHTML={{__html: dompurify.sanitize(board.board_detail)}}></p>
          </div>
          {userId === '' ? (
            <div className="board-subscribe">
              <p>
                <span>{totalBoardSubscribe}</span>
                <span>구독중</span>
              </p>
            </div>
          ) : (
          <div className="board-subscribe">
            <button onClick={subscribe ? () => handleSubscribe(false) : () => handleSubscribe(true)}>
              {subscribe ? '구독중' : '구독하기'}
            </button>
            <p>
              <span>{totalBoardSubscribe}</span>
              <span>구독중</span>
            </p>
          </div>
          )}
        </div>

      ))}
      <VisitedModule boardVisited={boardVisited} userSubscribe={userSubscribe}/>
      

      <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh}/>

      <List boardId={id} postCategory={postCategory} boardCate={boardCate} autoRefresh={autoRefresh}/>
    </div>
  );
}

export default Board;