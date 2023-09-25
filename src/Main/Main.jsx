import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/main.css';
import { debounce } from 'lodash';

function Main(props) {

    const [text, setText] = useState('');
    const [inputFocus, setInputFocus] = useState(false);
    const [searchList, setSearchList] = useState([]);
    const inputRef = useRef(null);

    const getSearchList = debounce(async (text) => {
        try {
            const formData = new FormData();
            formData.append('search', text);
            const response = await axios.post('http://localhost/myboard_server/Board/Board_Search.php', formData);
            setSearchList(response.data.list);
        } catch (error) {
            console.error(error);
        }
    }, 500);

    const handleInputFocus = () => {
        const input = inputRef.current;

        if(input === document.activeElement){
            setInputFocus(true);
        } else {
            setInputFocus(false);
        }
    };
    
    useEffect(() => {
        if (text.length > 1) {
            getSearchList(text);
        } else {
            setSearchList([]);
        }
    }, [text]);

  return (
    <div className='board-container'>
      <div className="main-container-wrap">
        <p>메인 화면은 아직 만들고 있어요!</p>

        <input type="text" onChange={(e) => setText(e.target.value)} onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)} ref={inputRef} className='main-search-board'/>

        <ul className={inputFocus ? 'searchbox active' : 'searchbox'}>
            {searchList < 1 ? (
                <li>검색어를 입력해주세요.</li>
            ) : (
                searchList.map((search, index) => (
                    <li key={index}>
                        <Link to={`/board/${search.id}`}>
                            {search.board_name}
                        </Link>
                    </li>
                ))
            )}
        </ul>

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
    </div>
  );
}

export default Main;