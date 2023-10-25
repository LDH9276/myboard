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
            const response = await axios.post('http://localhost/myboard_serverl/Board/Board_Search.php', formData);
            setSearchList(response.data.list);
        } catch (error) {
            console.error(error);
        }
    }, 500);
    
    useEffect(() => {
        if (text.length > 1) {
            getSearchList(text);
        } else {
            setSearchList([]);
        }
    }, [text]);

  return (
    <div className=' w-full flex items-center h-[100svh] box-border px-4 bg-primary'>
      <div className="max-w-[768px] w-full flex flex-col items-center shadow-xl bg-white px-4 box-border mx-auto">

        <h2>
            <img src={`${process.env.PUBLIC_URL}/logo.svg`} alt="logo" className='w-[200px] h-[100px] object-contain mt-6'/>
        </h2>

        <p className='text-xl font-bold mt-10 my-6'>메인 화면은 아직 만들고 있어요!</p>

        <input type="text" onChange={(e) => setText(e.target.value)} onFocus={() => setInputFocus(true)} onBlur={() => setInputFocus(false)} ref={inputRef} className='text-[#222] w-4/5 border-b-2 border-b-primary outline-none leading-10 xl:w-1/2 mb-4 focus:border-b-secondary placeholder:text-center' placeholder='찾으시는 게시판이 있으신가요?'/>

        <ul className={inputFocus || searchList.length > 0 ? 'w-4/5 block text-left mx-auto border-1 mb-4 xl:w-1/2 ' : 'w-full hidden text-left mx-auto border-1 xl:w-1/2'}>
            {searchList < 1 ? (
                <li className='block w-full leading-8 text-center'>검색어를 입력해주세요.</li>
            ) : (
                searchList.map((search, index) => (
                    <li key={index}>
                        <Link to={`/board/${search.id}`} className='block w-full leading-8'>
                            {search.board_name}
                        </Link>
                    </li>
                ))
            )}
        </ul>

        <Link to='/board/1' className='w-4/5 mt-[2rem]'>
          <button className='btn w-full mb-4 bg-primary text-white rounded-none'>
            게시판으로 가기
          </button>
        </Link>

        <Link to='/board/2' className='w-4/5 mb-[2rem]'>
          <button className='btn w-full bg-secondary text-white rounded-none'>
            게시판2로 가기
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Main;