import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';

function Subscribe({board, boardId, handleSubscribe}) {
    
    useEffect(() => {
        console.log(board);
    }, [board]);

    useEffect(() => {
        console.log(boardId);
    }, [boardId]);

    return (
        <li>
            <Link to = {`/board/${boardId}`} className="board-subscribelist-item">
                {board}
            </Link>
            <button onClick={() => handleSubscribe(boardId, false, "module")}>
                구독취소
            </button>
        </li>
    );
}

export default Subscribe;