import React, { useEffect, useState } from 'react';
import List from './List';
import axios from 'axios';
import dompurify from 'dompurify';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
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
  const [boardChange, setBoardChange] = useState(false);

  const boardVisitedLink = "http://localhost/myboard_server/Board/Board_VisitedCheck.php"
  const boardVisitedCheck = "http://localhost/myboard_server/Board/Board_VisitedModule.php";

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
  const visitedCheck = async () => {
    const formData = new FormData();
    formData.append('user_id', sessionStorage.getItem('userId'));
    const visitedCheck = await axios.post(boardVisitedCheck, formData);
    setBoardVisited(visitedCheck.data.result);
    console.log(visitedCheck.data.result);
  }
  
  useEffect(() => {
    readBoard();
  }, [id]);
    
  useEffect(() => {
    if (userId && id) {
      visitedAdd();
    }
  }, [userId, id]);
  
  const visitedAdd = async () => {
    const formData = new FormData();
    formData.append('user_id', sessionStorage.getItem('userId'));
    formData.append('board_id', id);
    const visitedAdd = await axios.post(boardVisitedLink, formData);
    visitedCheck();
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
        </div>

      ))}
      {userId ? (<VisitedModule boardVisited={boardVisited}/>) : ''}
      

      <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh}/>

      <List boardId={id} postCategory={postCategory} boardCate={boardCate} autoRefresh={autoRefresh}/>
    </div>
  );
}

export default Board;