import React, { useEffect, useState } from 'react';
import List from './List';
import axios from 'axios';
import dompurify from 'dompurify';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import './css/board.css';
import ListModule from './ListModule';
import { boardOppend } from '../Redux/Board';

function Board() {

  const boardLink = "http://localhost/myboard_server/Board/Board_ListCheck.php";
  const dispatch = useDispatch();
  const [boardCate, setBoardCate] = useState('*');
  const [boardList, setBoardList] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [postCategory, setPostCategory] = useState([]);

  const { id } = useParams();

  const readBoard = async () => {
    try {
      const response = await axios.post(`${boardLink}?id=${id}`);
      console.log(response.data.boardlist);
      console.log(response.data.boardlist.board_category);
      setBoardList(response.data.boardlist);
      setPostCategory(response.data.boardlist[0].board_category);
      dispatch(boardOppend(id, response.data.boardlist[0].board_name));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    readBoard();
    console.log(boardCate);
  }, []);
    
  useEffect(() => {
    console.log(boardCate);
  }, [boardCate]);

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
      <ListModule setBoardCate={setBoardCate} postCategory={postCategory} boardCate={boardCate} setAutoRefresh={setAutoRefresh} autoRefresh={autoRefresh}/>

      <List boardId={id} postCategory={postCategory} boardCate={boardCate} autoRefresh={autoRefresh}/>
    </div>
  );
}

export default Board;