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

  const userId = useSelector(state => state.userId);
  const boardLink = process.env.REACT_APP_BOARD_LIST_CHECK;
  const dispatch = useDispatch();
  const [boardCate, setBoardCate] = useState('*');
  const [boardList, setBoardList] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [postCategory, setPostCategory] = useState([]);

  const { id } = useParams();

  const readBoard = async () => {
    try {
      console.log(id);
      dispatch(boardOppend(id, userId));
      const response = await axios.post(`${boardLink}?id=${id}`);
      setBoardList(response.data.boardlist);
      setPostCategory(response.data.boardlist[0].board_category);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    readBoard();
  }, [id]);
    
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