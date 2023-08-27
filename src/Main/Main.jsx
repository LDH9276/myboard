import React from 'react';
import { Link } from 'react-router-dom';

function Main(props) {
  return (
    <div>
      <p>메인 화면은 아직 만들고 있어요!</p>

      <Link to='/board/1'>
        <button>
          게시판으로 가기
        </button>
      </Link>

      <Link to='/board/2'>
        <button>
          게시판2로 가기
        </button>
      </Link>

    </div>
  );
}

export default Main;